const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
    console.log('🔄 Probando conexión a la base de datos...\n');
    
    try {
        // Crear conexión
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '1234',
            database: process.env.DB_NAME || 'ieve_system'
        });

        console.log('✅ Conexión establecida exitosamente');
        
        // Probar consulta básica
        const [rows] = await connection.execute('SELECT 1 as test');
        console.log('✅ Consulta de prueba exitosa:', rows[0]);
        
        // Verificar tablas existentes
        const [tables] = await connection.execute('SHOW TABLES');
        console.log('\n📋 Tablas en la base de datos:');
        tables.forEach(table => {
            console.log(`  - ${Object.values(table)[0]}`);
        });
        
        // Verificar datos de prueba
        console.log('\n👥 Verificando datos de prueba:');
        
        const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
        console.log(`  - Usuarios: ${users[0].count}`);
        
        const [courses] = await connection.execute('SELECT COUNT(*) as count FROM courses');
        console.log(`  - Cursos: ${courses[0].count}`);
        
        const [students] = await connection.execute('SELECT COUNT(*) as count FROM students');
        console.log(`  - Estudiantes: ${students[0].count}`);
        
        const [absences] = await connection.execute('SELECT COUNT(*) as count FROM absences');
        console.log(`  - Faltas: ${absences[0].count}`);
        
        // Mostrar algunos usuarios de ejemplo
        console.log('\n🔑 Usuarios de ejemplo para login:');
        const [sampleUsers] = await connection.execute('SELECT username, role FROM users LIMIT 6');
        sampleUsers.forEach(user => {
            console.log(`  - Usuario: "${user.username}" | Rol: ${user.role}`);
        });
        
        await connection.end();
        console.log('\n✅ Prueba de conexión completada exitosamente');
        
    } catch (error) {
        console.error('❌ Error en la conexión:', error.message);
        console.error('\n🔧 Posibles soluciones:');
        console.error('  1. Verificar que MySQL esté ejecutándose');
        console.error('  2. Verificar credenciales en el archivo .env');
        console.error('  3. Verificar que la base de datos "ieve_system" exista');
        console.error('  4. Verificar permisos del usuario MySQL');
        
        process.exit(1);
    }
}

// Ejecutar la prueba
testConnection();