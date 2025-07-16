import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prompt } from "enquirer";

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log("🔐 Configuración de Usuario Administrador\n");

    // Solicitar datos del admin
    const responses = await prompt([
      {
        type: "input",
        name: "name",
        message: "Nombre del administrador:",
        initial: "Administrador",
      },
      {
        type: "input",
        name: "email",
        message: "Email del administrador:",
        validate: (value: string) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value) ? true : "Ingresa un email válido";
        },
      },
      {
        type: "password",
        name: "password",
        message: "Contraseña (mínimo 8 caracteres):",
        validate: (value: string) => {
          return value.length >= 8
            ? true
            : "La contraseña debe tener al menos 8 caracteres";
        },
      },
      {
        type: "password",
        name: "confirmPassword",
        message: "Confirmar contraseña:",
      },
    ]);

    // Validar que las contraseñas coincidan
    if (responses.password !== responses.confirmPassword) {
      console.error("❌ Las contraseñas no coinciden");
      process.exit(1);
    }

    // Verificar si ya existe un usuario con ese email
    const existingUser = await prisma.user.findUnique({
      where: { email: responses.email },
    });

    if (existingUser) {
      console.log("⚠️  Ya existe un usuario con ese email");

      const updateResponse = await prompt({
        type: "confirm",
        name: "update",
        message: "¿Deseas actualizar el usuario existente a ADMIN?",
        initial: false,
      });

      if (updateResponse.update) {
        // Hash de la nueva contraseña
        const hashedPassword = await bcrypt.hash(responses.password, 12);

        // Actualizar usuario existente
        const updatedUser = await prisma.user.update({
          where: { email: responses.email },
          data: {
            name: responses.name,
            password: hashedPassword,
            role: "ADMIN",
          },
        });

        console.log("✅ Usuario actualizado exitosamente:");
        console.log(`   📧 Email: ${updatedUser.email}`);
        console.log(`   👤 Nombre: ${updatedUser.name}`);
        console.log(`   🔐 Rol: ${updatedUser.role}`);
      } else {
        console.log("❌ Operación cancelada");
        process.exit(0);
      }
    } else {
      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(responses.password, 12);

      // Crear nuevo usuario admin
      const newUser = await prisma.user.create({
        data: {
          name: responses.name,
          email: responses.email,
          password: hashedPassword,
          role: "ADMIN",
        },
      });

      console.log("✅ Usuario administrador creado exitosamente:");
      console.log(`   📧 Email: ${newUser.email}`);
      console.log(`   👤 Nombre: ${newUser.name}`);
      console.log(`   🔐 Rol: ${newUser.role}`);
      console.log(`   📅 Creado: ${newUser.createdAt}`);
    }

    console.log("\n🎉 Ya puedes acceder al panel admin en /admin");
  } catch (error) {
    console.error("❌ Error al crear usuario admin:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
  createAdminUser();
}

export { createAdminUser };
