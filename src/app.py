"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from datetime import datetime
from pytz import timezone
from flask import Flask, request, jsonify, url_for, send_from_directory, render_template
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, User, Plan, Categories, UserPlan, AssistantPlan
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_cors import CORS

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

from flask_mail import Mail, Message

from flask_bcrypt import Bcrypt

import cloudinary
import cloudinary.uploader
import cloudinary.api


cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)



ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app = Flask(__name__)

app.config.update(dict(
    DEBUG=False,
    MAIL_SERVER='smpt.gmail.com',
    MAIL_PORT=587,
    MAIL_USE_TL=True,
    MAIL_USE_SSL=False,
    MAIL_USERNAME='bplan4geeks@gmail.com',
    MAIL_PASSWORD=os.getenv('MAIL_PASSWORD')
))

mail = Mail(app)
app.url_map.strict_slashes = False

app.config["JWT_SECRET_KEY"] = os.getenv("JWT-KEY")
jwt = JWTManager(app)

bcrypt = Bcrypt(app)

CORS(app)
# database configuration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints from the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response

@app.route('/register', methods=['POST'])
def register():
    body = request.get_json(silent=True)
    if body is None:
        return jsonify({'msg': 'Debes enviar la información en el body: email y password'}), 400

    if 'email' not in body:
        return jsonify({'msg': 'El campo email es obligatorio'}), 400
    if 'password' not in body:
        return jsonify({'msg': 'El campo password es obligatorio'}), 400
    if 'name' not in body:
        return jsonify({'msg': 'El campo name es obligatorio'}), 400
    user = User.query.filter_by(email=body['email']).first()
    if user is not None:
        return jsonify({'msg': f'El correo {body["email"]} ya ha sido registrado'}), 401
    new_user = User()
    new_user.email = body['email']
    new_user.password = bcrypt.generate_password_hash(body['password']).decode('utf-8')
    new_user.name = body['name']
    db.session.add(new_user)
    db.session.commit()
    access_token = create_access_token(identity=new_user.email)
    html_content = render_template('emails/welcome_email.html', name=body['name'])
    msg = Message(
        subject='Bienvenido a B PLAN',
        sender='bplan4geeks@gmail.com',
        recipients=[body['email']],
    )
    msg.reply_to = 'bplan4geeks@gmail.com'
    msg.html = html_content
    mail.send(msg)
    return jsonify({'msg': 'Nuevo usuario creado con éxito y correo de bienvenida enviado', 'token': access_token}), 201


@app.route('/login', methods=['POST'])
def login():
    body = request.get_json(silent=True)
    if body is None:
        return jsonify({'msg': 'Debes enviar información en el body: email y password'}), 400
    if 'email' not in body:
        return jsonify({'msg': 'El campo email es obligatorio'}), 400
    if 'password' not in body:
        return jsonify({'msg': 'El campo password es obligatorio'}), 400
    user = User.query.filter_by(email=body['email']).first()
    if user is None or not bcrypt.check_password_hash(user.password, body['password']):
        return jsonify({'msg': 'Correo o contraseña inválidos'}), 401
    access_token = create_access_token(identity=user.email)
    return jsonify({'token': access_token}), 200

@app.route('/private', methods=["GET"])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify({'msg': 'ok', 'user': current_user}), 200

@app.route('/user/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_email = get_jwt_identity()  
    print(f"Email obtenido del token: {user_email}") 

    user = User.query.filter_by(email=user_email).first()
    if user is None:
        print("Usuario no encontrado en la base de datos") 
        return jsonify({'msg': 'Usuario no encontrado'}), 404
    
    response_data = {
        'msg': 'ok',
        'user': {
            'id': user.id,
            'email': user.email,
            'name': user.name,
            'image': user.image
        }
    }
    print(f"Respuesta a enviar: {response_data}")  
    return jsonify(response_data), 200

@app.route('/user/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()
    if user is None:
        return jsonify({'msg': 'Usuario no encontrado'}), 404
    data = request.get_json()
    if 'name' in data: 
        user.name = data['name']
    if 'phone' in data:
        user.phone = data['phone']
    if 'description' in data:
        user.description = data['description']
    if 'address' in data:
        user.address = data['address']
    if 'birth' in data:
        user.birth = data['birth']
    if 'interests' in data:
        user.interests = data['interests']
    if 'image' in data:
        user.image = data['image']

    db.session.commit()

    return jsonify({'msg': 'ok', 'user': {'id': user.id, 
                                          'email': user.email, 
                                          'name': user.name, 
                                          'phone': user.phone,
                                          'description': user.description, 
                                          'address': user.address, 
                                          'birth': user.birth.isoformat() if user.birth else None,
                                          'interests': user.interests, 
                                          'image': user.image, 
                                          'subscription_date': user.subscription_date.isoformat() if user.subscription_date else None}}), 200

@app.route('/user/profile', methods=['DELETE'])
@jwt_required()
def delete_profile():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()
    if user is None:
        return jsonify({'msg': 'Usuario no encontrado'}), 404
    
    AssistantPlan.query.filter_by(user_id=user.id).delete()
    UserPlan.query.filter_by(user_id=user.id).delete()
    
    db.session.delete(user)
    db.session.commit()
    return jsonify({'msg': 'Usuario eliminado'}), 200

@app.route('/plans', methods=['POST'])
@jwt_required()
def create_plan():
    user_id = get_jwt_identity()
    body = request.get_json(silent=True)
    if body is None:
        return jsonify({'msg': 'Debes añadir información para el plan'}), 400
    if 'name' not in body:
        return jsonify({'msg': 'El campo name es obligatorio'}), 400
    if 'people' not in body:
        return jsonify({'msg': 'El campo people es obligatorio'}), 400
    if 'date' not in body:
        return jsonify({'msg': 'El campo date es obligatorio'}), 400
    if 'start_time' not in body:
        return jsonify({'msg': 'El campo start_time es obligatorio'}), 400
    if 'end_time' not in body:
        return jsonify({'msg': 'El campo end_time es obligatorio'}), 400
    if 'category_id' not in body:
        return jsonify({'msg': 'El campo category_id es obligatorio'}), 400

    user = User.query.filter_by(email=user_id).first()
    if not user:
        return jsonify({'msg': 'Usuario no encontrado'}), 404

    # Create the new plan
    new_plan = Plan(
        name=body['name'],
        people=body['people'],
        date=body['date'],
        start_time=body['start_time'],
        end_time=body['end_time'],
        category_id=body['category_id'],
        creator_id=user.id, 
    )

    db.session.add(new_plan)
    db.session.commit()

    return jsonify({'msg': 'Plan creado exitosamente', 'plan': new_plan.serialize()}), 201


@app.route('/plans', methods=['GET'])
def get_plans():
    plans = Plan.query.all()
    return jsonify([plan.serialize() for plan in plans]), 200

@app.route('/plans/<int:plan_id>', methods=['GET'])
def get_single_plan(plan_id):
    plan = Plan.query.get(plan_id)
    if plan is None:
        return jsonify({'msg': f'El plan con id {plan_id} no existe'}), 404
    creator = User.query.get(plan.creator_id)
    plan_serialized = plan.serialize()
    plan_serialized['creator'] = {
        'id': creator.id,
        'name': creator.name,
        'email': creator.email
    }
    plan_serialized['assistants'] = [assistant_plan.assistant.serialize() for assistant_plan in plan.assistant_plans]
    return jsonify({'msg': 'ok', 'data': plan_serialized}), 200

@app.route('/plans/<int:plan_id>', methods=['PUT'])
def put_plan(plan_id):
    plan = Plan.query.get(plan_id)
    if plan is None:
        return jsonify({'msg': f'El plan con id {plan_id} no existe'}), 404
    data = request.get_json()
    if 'name' in data: 
        plan.name = data['name']
    
    if 'people' in data:
        active_users = plan.people_active
        if data['people'] < active_users:
            return jsonify({'msg': f'No puedes reducir la capacidad a menos de {active_users} personas porque ya hay {active_users} apuntadas.'}), 400
        plan.people = data['people']
    db.session.commit()
    plan_serialized = plan.serialize()
    plan_serialized['assistants'] = [assistant_plan.assistant.serialize() for assistant_plan in plan.assistant_plans]
    return jsonify({'msg': 'ok', 'data': plan_serialized}), 200

@app.route('/plans/<int:plan_id>', methods=['DELETE'])
def delete_plan(plan_id):
    plan = Plan.query.get(plan_id)
    if plan is None:
        return jsonify({'msg': f'El plan con id {plan_id} no existe'}), 404

    db.session.delete(plan)
    db.session.commit()

    return jsonify({'msg': 'Plan eliminado exitosamente'}), 200

@app.route('/upload-profile-image', methods=['POST'])
@jwt_required()
def upload_profile_image():
    
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"error": "Token no proporcionado"}), 403 

    
    if 'image' not in request.files:
        return 'No image part', 400

    image = request.files['image']
    if image.filename == '':
        return 'No selected file', 400

    try:
        
        upload_result = cloudinary.uploader.upload(image)
       
        image_url = upload_result['secure_url']

        print("Image uploaded to Cloudinary, URL: ", image_url) 

        
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()
        if user is None:
            return jsonify({'msg': 'Usuario no encontrado'}), 404
        
       
        user.image = image_url
        db.session.commit()  

        print(f"User profile updated with image URL: {user.image}")  

        return jsonify({"msg": "Imagen de perfil actualizada exitosamente", "imageUrl": image_url}), 200

    except Exception as e:
        print(f"Error uploading image: {str(e)}")  
        return jsonify({"error": str(e)}), 500
