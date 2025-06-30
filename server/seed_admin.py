from app import create_app
from models import db, User

app = create_app()

with app.app_context():
    # Fetch the user by username or email
    user = User.query.filter_by(username='Larry').first()

    if user:
        user.is_admin = True
        db.session.commit()
        print(f"✅ User '{user.username}' is now an admin.")
    else:
        print("❌ User not found.")

