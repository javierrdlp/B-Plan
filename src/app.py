"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
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

from flask_bcrypt import Bcrypt

# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False

app.config["JWT_SECRET_KEY"] = os.getenv("JWT-KEY")
jwt = JWTManager(app)

bcrypt = Bcrypt(app)


CORS(app)
# database condiguration
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

# Add all endpoints form the API with a "api" prefix
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
    if body == None:
        return jsonify({'msg': 'Debes enviar la información el body: email y password'})
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
    return jsonify({'msg': 'Nuevo usuario creado con exito'}), 201

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
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    return jsonify({'msg': 'ok', 'user': current_user}), 200

@app.route('/user/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()
    if user is None:
        return jsonify({'msg': 'Usuario no encontrado'}), 404
    return jsonify({'msg': 'ok', 'user': {'id': user.id, 'email': user.email, 'name': user.name}}), 200

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
    
    # Eliminamos la asistencia del plan al eliminar el usuario
    AssistantPlan.query.filter_by(user_id=user.id).delete()
    
    # Eliminamos los planes asociados al usuario
    UserPlan.query.filter_by(user_id=user.id).delete()
    
    db.session.delete(user)
    db.session.commit()
    return jsonify({'msg': 'Usuario eliminado'}), 200

@app.route('/plans', methods=['POST'])
def create_plan():
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

    new_plan = Plan(
        name=body['name'],
        people=body['people'],
        date=body['date'],
        start_time=body['start_time'],
        end_time=body['end_time'],
        longitude=body.get('longitude'),
        latitude=body.get('latitude'),
        category_id=body['category_id'],
        image=body.get('image')
    )
    
    db.session.add(new_plan)
    db.session.commit()
    return jsonify({'msg': 'Nuevo plan creado con éxito', 'plan': new_plan.serialize()}), 201

@app.route('/plans', methods=['GET'])
def get_plans():
    plans = Plan.query.all()
    return jsonify([plan.serialize() for plan in plans]), 200

# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
