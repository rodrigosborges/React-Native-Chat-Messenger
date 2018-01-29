module.exports = function (sequelize, DataTypes) {
	var Contact = sequelize.define('contact', {
        user_id: DataTypes.INTEGER,
		contact_id: DataTypes.INTEGER,
	});
	return Contact;
}