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

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<RendAni />}>
        <Route index element={
          <PublicProtection>
            <LoginPage />
          </PublicProtection>
        } />
        <Route path="admin" element={
          <ProtectedRoutes roles={['Administrador']}>
            <AdminPage />
          </ProtectedRoutes>
        } />
        <Route path="jefe" element={
          <ProtectedRoutes roles={['Jefe', 'Administrador']}>
            <JefePage />
          </ProtectedRoutes>
        } />
        <Route path="tecnico" element={
          <ProtectedRoutes roles={['Tecnico', 'Administrador']}>
            <TecnicoPage />
          </ProtectedRoutes>
        } />
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
