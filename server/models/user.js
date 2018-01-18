module.exports = function (sequelize, DataTypes) {
	var User = sequelize.define('user', {
		name: DataTypes.STRING,
		email: DataTypes.STRING,
		status: DataTypes.STRING,
		password: DataTypes.STRING,
		remember_token: DataTypes.STRING,
	});
	
	return User;
}