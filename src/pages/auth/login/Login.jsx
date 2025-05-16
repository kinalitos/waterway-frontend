import { colors } from "@/pages/auth/login/colors.js";
import { LoginForm } from "@/pages/auth/login/LoginForm.js";
import { useAuth } from "@/providers/AuthProvider.js";
import { LoggedInView } from "@/pages/auth/login/LoggedInView.js";

export default function Login() {
  const { authenticated } = useAuth()

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left side - Login Form */}
      {!authenticated && (
        <LoginForm/>
      )}
      {authenticated && (
        /*Already logged in page*/
        <LoggedInView />
      )}

      {/* Right side - Image */}
      <div className="hidden w-1/2 md:block">
        <div className="relative h-full w-full">
          <img
            src="https://i.pinimg.com/736x/ab/35/7f/ab357f0016e5c66e6ea85ea5d06db0dd.jpg"
            alt="Río Motagua"
            className="h-full w-full object-cover"
          />
          <div
            className="absolute bottom-0 left-0 right-0 p-8 text-white"
            style={{
              background: `linear-gradient(to top, ${colors.darkest}CC, transparent)`,
              backdropFilter: "blur(2px)",
            }}
          >
            <h2 className="text-3xl font-bold">Río Motagua</h2>
            <p className="mt-2 text-lg">El río más largo de Guatemala, un tesoro natural que debemos proteger.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
