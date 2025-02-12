from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    name = db.Column(db.String(80), nullable=False)
    phone = db.Column(db.String(15), nullable=True)
    description = db.Column(db.Text, nullable=True)
    address = db.Column(db.String(255), nullable=True)
    birth = db.Column(db.Date, nullable=True)
    interests = db.Column(db.String(255), nullable=True)
    image = db.Column(db.String(255), nullable=True)
    subscription_date = db.Column(db.Date, nullable=True)

    plans = db.relationship('Plan', back_populates='user')
    user_plans = db.relationship('UserPlan', back_populates='user')
    assistant_plans = db.relationship('AssistantPlan', back_populates='user')

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "phone": self.phone,
            "description": self.description,
            "address": self.address,
            "birth": self.birth.isoformat() if self.birth else None,
            "interests": self.interests,
            "image": self.image,
            "subscription_date": self.subscription_date.isoformat() if self.subscription_date else None,
        }
    
class Categories(db.Model):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)
    image = db.Column(db.String(255), unique=True, nullable=False)

    plans = db.relationship('Plan', back_populates='category')

    def __repr__(self):
        return f'<Categories {self.name}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "image": self.image,
        }

class Plan(db.Model):
    __tablename__ = 'plan'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    people = db.Column(db.Integer, nullable=False)
    people_active = db.Column(db.Integer, nullable=False, default=0)
    date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    longitude = db.Column(db.String(50), nullable=True)
    latitude = db.Column(db.String(50), nullable=True)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    image = db.Column(db.String(255), nullable=True)
    status = db.Column(db.String(50), nullable=False, default="open")
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    category = db.relationship('Categories', back_populates='plans')
    user = db.relationship('User', back_populates='plans')
    user_plans = db.relationship('UserPlan', back_populates='plan')
    assistant_plans = db.relationship('AssistantPlan', back_populates='plan')

    def __repr__(self):
        return f'<Plan {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "people": self.people,
            "people_active": self.people_active,
            "date": self.date.isoformat() if self.date else None,
            "start_time": self.start_time.isoformat() if self.start_time else None,
            "end_time": self.end_time.isoformat() if self.end_time else None,
            "longitude": self.longitude,
            "latitude": self.latitude,
            "category": self.category_id,
            "image": self.image,
            "status": self.status
        }


class UserPlan(db.Model):
    __tablename__ = 'user_plan'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    plan_id = db.Column(db.Integer, db.ForeignKey('plan.id'), nullable=False)

    user = db.relationship('User', back_populates='user_plans')
    plan = db.relationship('Plan', back_populates='user_plans')

    def __repr__(self):
        return f'<UserPlan user_id={self.user_id} plan_id={self.plan_id}>'

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "plan_id": self.plan_id,
        }


class AssistantPlan(db.Model):
    __tablename__ = 'assistant_plan'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    plan_id = db.Column(db.Integer, db.ForeignKey('plan.id'), nullable=False)

    user = db.relationship('User', back_populates='assistant_plans')
    plan = db.relationship('Plan', back_populates='assistant_plans')

    def __repr__(self):
        return f'<AssistantPlan user_id={self.user_id} plan_id={self.plan_id}>'

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "plan_id": self.plan_id,
        }