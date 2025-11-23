import 'next-auth'

declare module 'next-auth' {
  interface User {
    empresaId: string
    empresaNombre: string
    empresaSubdominio: string
    empresaEstado: string
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
      empresaId: string
      empresaNombre: string
      empresaSubdominio: string
      empresaEstado: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    empresaId: string
    empresaNombre: string
    empresaSubdominio: string
    empresaEstado: string
  }
}
