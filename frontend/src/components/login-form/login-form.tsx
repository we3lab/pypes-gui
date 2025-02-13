import { SyntheticEvent, useState } from "react";
import { signIn } from "next-auth/react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import InfoTooltip from "../global/info-tooltip";

export default function Login() {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState<boolean>(false);

  //   const toggle = () =>{
  //     setShowPassword(!setShowPassword)
  // }
  // const { mutateAsync }  = trpc.userdata.loginUser.useMutation();

  const signInUser = async (e: SyntheticEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      ...userData,
      redirect: false,
      callbackUrl: "/",
    });
    if (res?.status === 401) {
      setShowError(true);
    } else if (res?.status === 200) {
      window.location.href = "/";
    }
  };

  // const signInUser2 = async (e: SyntheticEvent) => {
  //   e.preventDefault()
  //   const response = await mutateAsync(
  //     {email: userData.email, password: userData.password}
  //   )
  //   console.log(response)
  // }

  return (
    <>
      <InfoTooltip
        open={showError}
        onCloseAction={() => {
          setShowError(false);
        }}
        tooltipText="Invalid credentials! Please try again."
      />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-clip-border p-6 bg-white border-4">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 max-w">
            Welcome! Enter your email and password to access your account.
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={signInUser}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={userData.email}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={userData.password}
                  onChange={(e) =>
                    setUserData({ ...userData, password: e.target.value })
                  }
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <div className="relative bottom-4 ">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                    className="absolute inset-y-0 right-0 px-3 flex items-center focus:outline-none"
                    style={{ top: "50%", transform: "translateY(-50%)" }} // Center the icon vertically
                  >
                    {showPassword ? (
                      <VisibilityOffIcon className="h-6 w-6 text-gray-400" /> // Eye Off Icon when password is visible
                    ) : (
                      <VisibilityIcon className="h-6 w-6 text-gray-400" /> // Eye Icon when password is hidden
                    )}
                  </button>
                </div>
              </div>
              {/* <div className="text-sm text-right">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
              </div> */}
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Dont have and account?{" "}
            <a
              href="/register"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Register here!
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
