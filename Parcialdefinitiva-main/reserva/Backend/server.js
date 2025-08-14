const express = require('express');
const cors = require('cors');
const oracledb = require('oracledb');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 4000;

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const dbConfig = {
    user: "nagaz",
    password: "12345",
    connectString: "localhost:1521/XEPDB1"
};

app.use(cors());
app.use(express.json());

async function initializeDb() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Pool de conexión a Oracle creado exitosamente.');
    } catch (err) {
        console.error('Error al crear el pool de conexión:', err);
        process.exit(1);
    }
}

app.get('/', (req, res) => {
    res.send('API de Arena 7 de reservas funcionando y lista!');
});

app.get('/api/canchas', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute('SELECT * FROM CANCHAS');
        res.json(result.rows);
    } catch (err) {
        console.error('Error en GET /api/canchas:', err);
        res.status(500).json({ message: 'Error al obtener las canchas de la base de datos.' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

app.post('/api/register', async (req, res) => {
    const { nombres, apellidos, dni, email, telefono, password, confirmPassword } = req.body;
    if (!nombres || !apellidos || !dni || !email || !telefono || !password || !confirmPassword) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Las contraseñas no coinciden.' });
    }
    let connection;
    try {
        connection = await oracledb.getConnection();
        const userExists = await connection.execute('SELECT COUNT(*) AS count FROM USERS WHERE EMAIL = :email', { email });
        if (userExists.rows[0].COUNT > 0) {
            return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
        }
        const hashedPassword = password;
        const result = await connection.execute(
            `INSERT INTO USERS (NOMBRES, APELLIDOS, DNI, EMAIL, TELEFONO, PASSWORD) VALUES (:nombres, :apellidos, :dni, :email, :telefono, :password)`,
            { nombres, apellidos, dni, email, telefono, password: hashedPassword },
            { autoCommit: true }
        );
        console.log('Usuario registrado:', { nombres, email });
        res.status(201).json({ message: 'Registro exitoso. Ya puedes iniciar sesión.', user: { nombres, email } });
    } catch (err) {
        console.error('Error en POST /api/register:', err);
        res.status(500).json({ message: 'Error al registrar usuario.' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Correo y contraseña son obligatorios.' });
    }
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute('SELECT ID, NOMBRES, EMAIL, PASSWORD, IS_ADMIN FROM USERS WHERE EMAIL = :email', { email });
        const user = result.rows[0];
        if (user) {
            if (user.PASSWORD === password) {
                console.log('Login exitoso para:', user.EMAIL);
                res.status(200).json({
                    message: 'Login exitoso',
                    token: 'fake-jwt-token-para-simulacion',
                    user: { id: user.ID, nombres: user.NOMBRES, email: user.EMAIL, is_admin: user.IS_ADMIN }
                });
            } else {
                console.log('Fallo de login para:', email);
                res.status(401).json({ message: 'Credenciales inválidas. Verifica tu correo y contraseña.' });
            }
        } else {
            console.log('Fallo de login para:', email);
            res.status(401).json({ message: 'Credenciales inválidas. Verifica tu correo y contraseña.' });
        }
    } catch (err) {
        console.error('Error en POST /api/login:', err);
        res.status(500).json({ message: 'Error al intentar iniciar sesión.' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

app.post('/api/reservations', async (req, res) => {
    const { userId, canchaId, date, time } = req.body;
    if (!userId || !canchaId || !date || !time) {
        return res.status(400).json({ message: 'Todos los campos de reserva son obligatorios.' });
    }
    let connection;
    try {
        connection = await oracledb.getConnection();
        const formattedDate = new Date(date).toISOString().split('T')[0];
        const checkAvailabilitySql = `
            SELECT COUNT(*) AS COUNT
            FROM RESERVATIONS
            WHERE CANCHA_ID = :canchaId AND TRUNC(RESERVATION_DATE) = TO_DATE(:formattedDate, 'YYYY-MM-DD') AND RESERVATION_TIME = :time
        `;
        const availabilityCheck = await connection.execute(checkAvailabilitySql, {
            canchaId, formattedDate, time
        });
        if (availabilityCheck.rows[0].COUNT > 0) {
            return res.status(409).json({ message: 'La hora seleccionada ya está reservada. Por favor, elige otra.' });
        }
        await connection.execute(
            `INSERT INTO RESERVATIONS (USER_ID, CANCHA_ID, RESERVATION_DATE, RESERVATION_TIME) VALUES (:userId, :canchaId, TO_DATE(:formattedDate, 'YYYY-MM-DD'), :time)`,
            { userId, canchaId, formattedDate, time },
            { autoCommit: true }
        );
        console.log('Nueva reserva creada:', { userId, canchaId, date, time });
        res.status(201).json({ message: 'Reserva creada exitosamente.' });
    } catch (err) {
        console.error('Error en POST /api/reservations:', err);
        res.status(500).json({ message: 'Error al crear la reserva.' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

app.get('/api/users/:userId/reservations', async (req, res) => {
    const userId = parseInt(req.params.userId);
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `SELECT
                R.ID,
                R.RESERVATION_DATE,
                R.RESERVATION_TIME,
                R.STATUS,
                C.NOMBRE AS CANCHANOMBRE,
                C.IMAGEN AS CANCHAIMAGEN
            FROM RESERVATIONS R
            JOIN CANCHAS C ON R.CANCHA_ID = C.ID
            WHERE R.USER_ID = :userId`,
            { userId }
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error en GET /api/users/:userId/reservations:', err);
        res.status(500).json({ message: 'Error al obtener las reservas del usuario.' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

app.get('/api/reservations/hours', async (req, res) => {
    const { canchaId, date } = req.query;

    if (!canchaId || !date) {
        console.error('Error en GET /api/reservations/hours: canchaId y date son obligatorios.');
        return res.status(400).json({ message: 'canchaId y date son obligatorios.' });
    }

    let connection;
    try {
        connection = await oracledb.getConnection();
        const formattedDate = new Date(date).toISOString().split('T')[0];

        const result = await connection.execute(
            `SELECT RESERVATION_TIME FROM RESERVATIONS WHERE CANCHA_ID = :canchaId AND TRUNC(RESERVATION_DATE) = TO_DATE(:formattedDate, 'YYYY-MM-DD')`,
            { canchaId, formattedDate }
        );

        const reservedHours = result.rows.map(row => row.RESERVATION_TIME);

        console.log(`Horas reservadas para cancha ${canchaId} en ${formattedDate}:`, reservedHours);
        res.json(reservedHours);
    } catch (err) {
        console.error('Error en GET /api/reservations/hours:', err);
        res.status(500).json({ message: 'Error al obtener las horas reservadas.' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

app.get('/api/admin/users', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute('SELECT ID, NOMBRES, APELLIDOS, DNI, EMAIL, TELEFONO, IS_ADMIN FROM USERS ORDER BY ID');
        
        const users = result.rows.map(row => ({
            id: row.ID,
            nombres: row.NOMBRES,
            apellidos: row.APELLIDOS,
            dni: row.DNI,
            email: row.EMAIL,
            telefono: row.TELEFONO,
            is_admin: row.IS_ADMIN
        }));

        res.status(200).json(users);
    } catch (err) {
        console.error('Error en GET /api/admin/users:', err);
        res.status(500).json({ message: 'Error al obtener la lista de clientes.' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

app.delete('/api/admin/reservations/:id', async (req, res) => {
    const reservationId = req.params.id;
    let connection;
    try {
        connection = await oracledb.getConnection();
        const sql = `DELETE FROM RESERVATIONS WHERE ID = :reservationId`;
        const result = await connection.execute(sql, { reservationId }, { autoCommit: true });

        if (result.rowsAffected === 0) {
            return res.status(404).json({ message: 'Reserva no encontrada.' });
        }

        res.status(200).json({ message: 'Reserva eliminada exitosamente.' });
    } catch (err) {
        console.error('Error en DELETE /api/admin/reservations/:id:', err);
        res.status(500).json({ message: 'Error al eliminar la reserva.' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

app.put('/api/admin/reservations/:id', async (req, res) => {
    const reservationId = req.params.id;
    const { userId, canchaId, date, time, status } = req.body;
    let connection;

    if (!userId || !canchaId || !date || !time || !status) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    try {
        connection = await oracledb.getConnection();
        const formattedDate = new Date(date).toISOString().split('T')[0];

        const sql = `
            UPDATE RESERVATIONS 
            SET USER_ID = :userId, CANCHA_ID = :canchaId, RESERVATION_DATE = TO_DATE(:formattedDate, 'YYYY-MM-DD'), RESERVATION_TIME = :time, STATUS = :status 
            WHERE ID = :reservationId
        `;
        const result = await connection.execute(sql, { userId, canchaId, formattedDate, time, status, reservationId }, { autoCommit: true });

        if (result.rowsAffected === 0) {
            return res.status(404).json({ message: 'Reserva no encontrada.' });
        }

        res.status(200).json({ message: 'Reserva actualizada exitosamente.' });
    } catch (err) {
        console.error('Error en PUT /api/admin/reservations/:id:', err);
        res.status(500).json({ message: 'Error al actualizar la reserva.' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

app.get('/api/admin/reservations', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `SELECT
                R.ID AS RESERVATION_ID,
                U.NOMBRES AS USER_NOMBRES,
                U.APELLIDOS AS USER_APELLIDOS,
                C.NOMBRE AS CANCHA_NOMBRE,
                R.RESERVATION_DATE,
                R.RESERVATION_TIME,
                R.STATUS
            FROM RESERVATIONS R
            JOIN USERS U ON R.USER_ID = U.ID
            JOIN CANCHAS C ON R.CANCHA_ID = C.ID
            ORDER BY R.RESERVATION_DATE DESC, R.RESERVATION_TIME DESC`
        );
        
        const reservations = result.rows.map(row => ({
            id: row.RESERVATION_ID,
            nombres: row.USER_NOMBRES,
            apellidos: row.USER_APELLIDOS,
            cancha: row.CANCHA_NOMBRE,
            fecha: row.RESERVATION_DATE,
            hora: row.RESERVATION_TIME,
            estado: row.STATUS
        }));

        res.status(200).json(reservations);
    } catch (err) {
        console.error('Error en GET /api/admin/reservations:', err);
        res.status(500).json({ message: 'Error al obtener las reservas de los clientes.' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

app.post('/api/admin/canchas', async (req, res) => {
    const { nombre, imagen, descripcion, precio_general, jugadores, duracion } = req.body;
    if (!nombre || !imagen || !descripcion || !precio_general || !jugadores || !duracion) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `INSERT INTO CANCHAS (NOMBRE, IMAGEN, DESCRIPCION, PRECIO_GENERAL, JUGADORES, DURACION) VALUES (:nombre, :imagen, :descripcion, :precio_general, :jugadores, :duracion)`,
            { nombre, imagen, descripcion, precio_general, jugadores, duracion },
            { autoCommit: true }
        );
        res.status(201).json({ message: 'Cancha creada exitosamente.', id: result.lastRowid });
    } catch (err) {
        console.error('Error en POST /api/admin/canchas:', err);
        res.status(500).json({ message: 'Error al crear la cancha.' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

app.put('/api/admin/canchas/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, imagen, descripcion, precio_general, jugadores, duracion } = req.body;

    if (!nombre || !imagen || !descripcion || !precio_general || !jugadores || !duracion) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `UPDATE CANCHAS SET NOMBRE = :nombre, IMAGEN = :imagen, DESCRIPCION = :descripcion, PRECIO_GENERAL = :precio_general, JUGADORES = :jugadores, DURACION = :duracion WHERE ID = :id`,
            { nombre, imagen, descripcion, precio_general, jugadores, duracion, id },
            { autoCommit: true }
        );

        if (result.rowsAffected === 0) {
            return res.status(404).json({ message: 'Cancha no encontrada.' });
        }

        res.status(200).json({ message: 'Cancha actualizada exitosamente.' });
    } catch (err) {
        console.error('Error en PUT /api/admin/canchas/:id:', err);
        res.status(500).json({ message: 'Error al actualizar la cancha.' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

app.delete('/api/admin/canchas/:id', async (req, res) => {
    const { id } = req.params;
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `DELETE FROM CANCHAS WHERE ID = :id`,
            { id },
            { autoCommit: true }
        );

        if (result.rowsAffected === 0) {
            return res.status(404).json({ message: 'Cancha no encontrada.' });
        }

        res.status(200).json({ message: 'Cancha eliminada exitosamente.' });
    } catch (err) {
        console.error('Error en DELETE /api/admin/canchas/:id:', err);
        res.status(500).json({ message: 'Error al eliminar la cancha.' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

app.put('/api/admin/users/:id', async (req, res) => {
    const userId = req.params.id;
    const { nombres, apellidos, dni, email, telefono } = req.body;
    let connection;

    if (!nombres || !apellidos || !dni || !email || !telefono) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    try {
        connection = await oracledb.getConnection();
        const sql = `UPDATE USERS SET NOMBRES = :nombres, APELLIDOS = :apellidos, DNI = :dni, EMAIL = :email, TELEFONO = :telefono WHERE ID = :userId`;
        const result = await connection.execute(sql, { nombres, apellidos, dni, email, telefono, userId }, { autoCommit: true });

        if (result.rowsAffected === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        res.status(200).json({ message: 'Usuario actualizado exitosamente.' });
    } catch (err) {
        console.error('Error en PUT /api/admin/users/:id:', err);
        res.status(500).json({ message: 'Error al actualizar el usuario.' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

app.delete('/api/admin/users/:id', async (req, res) => {
    const userId = req.params.id;
    let connection;

    try {
        connection = await oracledb.getConnection();
        const sql = `DELETE FROM USERS WHERE ID = :userId`;
        const result = await connection.execute(sql, { userId }, { autoCommit: true });

        if (result.rowsAffected === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        res.status(200).json({ message: 'Usuario eliminado exitosamente.' });
    } catch (err) {
        console.error('Error en DELETE /api/admin/users/:id:', err);
        res.status(500).json({ message: 'Error al eliminar el usuario.' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

initializeDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor Backend de Arena 7 corriendo en http://localhost:${PORT}`);
        console.log('Endpoints disponibles:');
        console.log(`- GET /api/canchas`);
        console.log(`- POST /api/register`);
        console.log(`- POST /api/login`);
        console.log(`- POST /api/reservations`);
        console.log(`- GET /api/users/:userId/reservations`);
        console.log(`- GET /api/reservations/hours`);
        console.log(`- GET /api/admin/users`);
        console.log(`- PUT /api/admin/users/:id`);
        console.log(`- DELETE /api/admin/users/:id`);
        console.log(`- GET /api/admin/reservations`);
        console.log(`- POST /api/admin/canchas`);
        console.log(`- PUT /api/admin/canchas/:id`);
        console.log(`- DELETE /api/admin/canchas/:id`);
        console.log(`- PUT /api/admin/reservations/:id`);  
        console.log(`- DELETE /api/admin/reservations/:id`); 
    });
});