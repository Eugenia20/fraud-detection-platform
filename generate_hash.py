import bcrypt

# The password you want to hash
plain_password = "BankProtect>>0123jjyc"

# Generate the hash
hashed_password = bcrypt.hashpw(plain_password.encode('utf-8'), bcrypt.gensalt())

# Print the hashed password
print("Hashed Password:", hashed_password.decode('utf-8'))