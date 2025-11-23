import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { db } from '@/lib/db'
import { usuarios, empresas } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/error',
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Buscar usuario por email
        const [usuario] = await db
          .select()
          .from(usuarios)
          .where(eq(usuarios.email, credentials.email as string))
          .limit(1)

        if (!usuario) {
          return null
        }

        // Verificar contraseña
        const isValid = await bcrypt.compare(
          credentials.password as string,
          usuario.passwordHash
        )

        if (!isValid) {
          return null
        }

        // Verificar que el usuario esté activo
        if (!usuario.activo || usuario.bloqueado) {
          return null
        }

        // Obtener información de la empresa
        const [empresa] = await db
          .select()
          .from(empresas)
          .where(eq(empresas.id, usuario.empresaId))
          .limit(1)

        // Verificar que la empresa esté activa
        if (!empresa || empresa.estado === 'suspendida' || empresa.estado === 'cancelada') {
          return null
        }

        // Actualizar último login
        await db
          .update(usuarios)
          .set({ ultimoLogin: new Date() })
          .where(eq(usuarios.id, usuario.id))

        return {
          id: usuario.id,
          email: usuario.email,
          name: usuario.nombre,
          empresaId: usuario.empresaId,
          empresaNombre: empresa.nombre,
          empresaSubdominio: empresa.subdominio,
          empresaEstado: empresa.estado,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.empresaId = user.empresaId
        token.empresaNombre = user.empresaNombre
        token.empresaSubdominio = user.empresaSubdominio
        token.empresaEstado = user.empresaEstado
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string
        session.user.empresaId = token.empresaId as string
        session.user.empresaNombre = token.empresaNombre as string
        session.user.empresaSubdominio = token.empresaSubdominio as string
        session.user.empresaEstado = token.empresaEstado as string
      }
      return session
    },
  },
})
