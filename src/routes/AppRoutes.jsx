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
import { JefeLayout } from '../layouts/JefeLayout'
import { TecnicoLayout } from '../layouts/TecnicoLayout'
import { CrearUserPage } from '../pages/CrearUserPage'
import { ActualizarUserPage } from '../pages/ActualizarUserPage'
import { ClienteLayout } from '../layouts/ClienteLayout'
import { CrearIncidenciaPage } from '../pages/CrearIncidenciaPage'
import { IncidenciasPage } from '../pages/PagesComun/IncidenciasPage'
import { MaquinasPage } from '../pages/PagesComun/MaquinasPage'
import { CrearMaquinaPage } from '../pages/CrearMaquinaPage'
import { IncidenciaDetallesPage } from '../pages/PagesComun/IncidenciaDetallesPage'
import { ActualizarMaquinaPage } from '../pages/ActualizarMaquinaPage'

/**
 * Componente de rutas principales de la aplicación.
 * Define todas las rutas públicas y protegidas según el rol del usuario.
 *
 * Rutas principales:
 * - /               -> LoginPage (protegida como pública)
 * - /admin/*        -> Panel de administrador
 * - /jefe/*         -> Panel de jefe
 * - /tecnico/*      -> Panel de técnico
 * - /cliente/*      -> Panel de cliente
 *
 * @component
 * @returns {JSX.Element} Elemento JSX con la definición de rutas
 */
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
          <Route path="users/actualizar/:id" element={<ActualizarUserPage/>} />
          <Route path="maquinas" element={<MaquinasPage/>}/>
          <Route path="maquina/crear" element={<CrearMaquinaPage/>}/>
          <Route path="maquina/actualizar/:id" element={<ActualizarMaquinaPage/>} />
          <Route path="incidencias" element={<IncidenciasPage/>} />
          <Route path="incidencia/crear" element={<CrearIncidenciaPage/>}/>
          <Route path="incidencia/detalles/:id" element={<IncidenciaDetallesPage />}/>
        </Route>

        {/*RUTAS DE JEFE*/}
        <Route path="jefe" element={
          <ProtectedRoutes roles={['Jefe', 'Administrador']}>
            <JefeLayout />
          </ProtectedRoutes>
        }>
          <Route index element={<JefePage/>} />
          <Route path="incidencias" element={<IncidenciasPage/>} />
          <Route path="incidencia/detalles/:id" element={<IncidenciaDetallesPage />}/>
          <Route path="maquinas" element={<MaquinasPage/>}/>
        </Route>

        {/*RUTAS DE TECNICO*/}
        <Route path="tecnico" element={
          <ProtectedRoutes roles={['Tecnico', 'Administrador']}>
            <TecnicoLayout />
          </ProtectedRoutes>
        }>
          <Route index element={<TecnicoPage/>} />
          <Route path="incidencias" element={<IncidenciasPage/>} />
          <Route path="incidencia/detalles/:id" element={<IncidenciaDetallesPage />}/>
          <Route path="maquinas" element={<MaquinasPage/>}/>
        </Route>

        {/*RUTAS DE CLIENTE*/}
        <Route path="cliente" element={
          <ProtectedRoutes roles={['Cliente', 'Administrador']}>
            <ClienteLayout/>
          </ProtectedRoutes>
        }>
          <Route index element={<ClientPage/>} />
          <Route path="incidencias" element={<IncidenciasPage/>} />
          <Route path="incidencia/crear" element={<CrearIncidenciaPage/>}/>
          <Route path="incidencia/detalles/:id" element={<IncidenciaDetallesPage />}/>
          <Route path="maquinas" element={<MaquinasPage/>}/>
        </Route>
      </Route>
      <Route path='/*' element={<Navigate to={'/'} />} />
    </Routes>
  )
}
