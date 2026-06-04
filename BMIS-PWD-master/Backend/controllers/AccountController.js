const db = require("../config/db.js");

exports.changeUserRole = async (request, response) => {
    const connection = await db.getConnection();

    try {

        const { id } = request.params;
        const { Role } = request.body;

        const validRoles = ['admin', 'resident'];

        if (!validRoles.includes(Role)) {
            return response.status(400).json({
                message: 'Invalid role.'
            });
        }

        const [user] = await connection.query(
            'SELECT * FROM accounttable WHERE AccountID = ?',
            [id]
        );

        if (user.length === 0) {
            return response.status(404).json({
                message: 'User not found.'
            });
        }

        await connection.query(
            'UPDATE accounttable SET Role = ? WHERE AccountID = ?',
            [Role, id]
        );

        return response.status(200).json({
            success: true,
            message: 'Role updated successfully.'
        });

    } catch (error) {
        console.error(error);

        return response.status(500).json({
            success: false,
            message: 'Internal server error.'
        });

    } finally {
        connection.release();
    }
};

