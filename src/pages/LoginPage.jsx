import { AuthLayout } from '../layouts/AuthLayout';
import { Logo } from '../components/ui/Logo';
import { LoginForm } from '../components/auth/LoginForm';
import { DemoCredentials } from '../components/auth/DemoCredentials';
import { FeatureCard } from '../components/ui/FeatureCard';
import incidenciaIcon from '../assets/incidencia.svg';
import mantenimientoIcon from '../assets/herramientas.svg';
import "../styles/pages/loginPage.css";

export const LoginPage = () => {
  return (
    <AuthLayout
      left={
        <>
          <Logo />
          <div className='info-login'>
            <h1>Sistema de Gestión de Incidencias</h1>
            <p>
              Gestiona eficientemente las incidencias,
              máquinas y mantenimientos de tu empresa con nuestro sistema integral.
            </p>
          </div>
          <div className='tarjetas'>
            <FeatureCard
              icon={incidenciaIcon}
              title="Incidencias"
              description="Seguimiento en tiempo real"
            />

            <FeatureCard
              icon={mantenimientoIcon}
              title="Mantenimiento"
              description="Planificación preventiva"
            />
          </div>
        </>
      }
      right={
        <>
          <LoginForm />
          <DemoCredentials />
        </>
      }
    />
  );
}
