module.exports = function (sequelize, DataTypes) {
	var Message = sequelize.define('message', {
		content: DataTypes.TEXT,
    user_id: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
		receiver_id: DataTypes.INTEGER,
		group_id: DataTypes.INTEGER
	});
	return Message;
}