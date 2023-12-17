import User from './user';
import Token from './token';
import Role from './role';

User.belongsTo(Role, { constraints: false });
Role.hasMany(User);

Token.belongsTo(User, { constraints: false });
User.hasOne(Token);

export { User, Token, Role };
