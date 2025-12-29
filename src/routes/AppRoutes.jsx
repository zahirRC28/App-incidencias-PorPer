import { Route, Routes }  from 'react-router-dom'
import { Navigate } from 'react-router-dom'

import { RendAni } from '../components/RendAni'
import { LoginPage } from '../pages/LoginPage'

import { ProtectedRoutes } from '../components/protections/ProtectedRoutes'
import { PublicProtection } from '../components/protections/PublicProtection'

import { AdminPage } from '../pages/AdminPage'
import { JefePage } from '../pages/JefePage'
import { TecnicoPage } from '../pages/TecnicoPage'
import { ClientPage } from '../pages/ClientPage'
import { UsersPage } from '../pages/PagesComun/UsersPage'
import { AdminLayout } from '../layouts/AdminLayout'
import { CrearUserPage } from '../pages/CrearUserPage'
import { ActualizarUserPage } from '../pages/ActualizarUserPage'

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<RendAni />}>
        <Route index element={
          <PublicProtection>
            <LoginPage />
          </PublicProtection>
        } />
        {/*RUTAS DE ADMINISTRADOR*/}
        <Route path="admin" element={
          <ProtectedRoutes roles={['Administrador']}>
            <AdminLayout/>
          </ProtectedRoutes>
        }>
          <Route index element={<AdminPage/>} />
          {/*SUBRUTAS DE ADMIN*/}
          <Route path="users" element={<UsersPage/>} />
          <Route path="users/crear" element={<CrearUserPage/>} />
          <Route path="users/actualizar/:id" element={<ActualizarUserPage />} />
        </Route>

        {/*RUTAS DE JEFE*/}
        <Route path="jefe" element={
          <ProtectedRoutes roles={['Jefe', 'Administrador']}>
            <JefePage />
          </ProtectedRoutes>
        } />
        {/*RUTAS DE TECNICO*/}
        <Route path="tecnico" element={
          <ProtectedRoutes roles={['Tecnico', 'Administrador']}>
            <TecnicoPage />
          </ProtectedRoutes>
        } />
        {/*RUTAS DE CLIENTE*/}
        <Route path="cliente" element={
          <ProtectedRoutes roles={['Cliente', 'Administrador']}>
            <ClientPage />
          </ProtectedRoutes>
        } />
      </Route>
      <Route path='/*' element={<Navigate to={'/'} />} />
    </Routes>
  )
}
