import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useLoginMutation,
  useRegisterMutation,
  useSendOtpMutation,
  useResetPasswordMutation,
} from "@/features/api/authApi";
import { Loader2, Mail, Lock, User, ShieldCheck, KeyRound } from "lucide-react";
import { useState, useEffect } from "react"; 
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom"; 
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); 
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("login");
  const [otpSent, setOtpSent] = useState(false);

  const [signupInput, setSignupInput] = useState({ name: "", email: "", password: "", otp: "" });
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });
  const [forgetInput, setForgetInput] = useState({ email: "", otp: "", newPassword: "" });

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl === "signup" || tabFromUrl === "login" || tabFromUrl === "forget") {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const [registerUser, { isLoading: registerLoading }] = useRegisterMutation();
  const [loginUser, { isLoading: loginLoading }] = useLoginMutation();
  const [sendOtp, { isLoading: isOtpLoading }] = useSendOtpMutation();
  const [resetPassword, { isLoading: isResetLoading }] = useResetPasswordMutation();

  if (isAuthenticated) return <Navigate to="/" replace />;

  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;
    if (type === "signup") setSignupInput((prev) => ({ ...prev, [name]: value }));
    else if (type === "forget") setForgetInput((prev) => ({ ...prev, [name]: value }));
    else setLoginInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleOtpRequest = async (email) => {
    if (!email) return toast.error("Please enter email first");
    try {
      await sendOtp(email).unwrap(); 
      setOtpSent(true);
      toast.success("Verification code sent to your email!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to send OTP");
    }
  };

  const handleSubmit = async (type) => {
    try {
      if (type === "login") {
        if (!loginInput.email || !loginInput.password) return toast.error("All fields required");
        
        const loginData = {
          ...loginInput,
          role: loginInput.email === "officialacadify@gmail.com" ? "instructor" : "student"
        };

        const res = await loginUser(loginData).unwrap();
        toast.success(`Welcome back 🎉 ${res.user?.name || "User"}`);
        navigate("/");
      } 
      else if (type === "signup") {
        if (!signupInput.otp) return toast.error("Please verify OTP first");
        
        const registrationData = {
          ...signupInput,
          role: signupInput.email === "officialacadify@gmail.com" ? "instructor" : "student"
        };

        await registerUser(registrationData).unwrap();
        toast.success("Registration successful! Please login.");
        setActiveTab("login");
        setOtpSent(false);
      } 
      else if (type === "forget") {
        if (!forgetInput.otp || !forgetInput.newPassword) return toast.error("All fields required");
        await resetPassword(forgetInput).unwrap();
        toast.success("Password updated! Please login.");
        setActiveTab("login");
        setOtpSent(false);
      }
    } catch (err) {
      toast.error(err?.data?.message || "Action failed");
    }
  };

  const inputClass = "pl-10 rounded-xl bg-background text-foreground border-input h-11 focus-visible:ring-blue-600";

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-slate-50 dark:bg-zinc-950 p-4 transition-colors duration-500">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-[420px] transition-all duration-300">
        <TabsList className="grid w-full grid-cols-3 mb-6 p-1 bg-white dark:bg-zinc-900 shadow-sm rounded-2xl border dark:border-zinc-800">
          <TabsTrigger value="signup" className="rounded-xl font-bold text-xs uppercase">Signup</TabsTrigger>
          <TabsTrigger value="login" className="rounded-xl font-bold text-xs uppercase">Login</TabsTrigger>
          <TabsTrigger value="forget" className="rounded-xl font-bold text-xs uppercase">Reset</TabsTrigger>
        </TabsList>

        <TabsContent value="signup">
          <Card className="border-none shadow-2xl rounded-3xl overflow-hidden dark:bg-zinc-900">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-black tracking-tight uppercase italic dark:text-white">Join Us<span className="text-blue-600">.</span></CardTitle>
              <CardDescription className="text-xs">Create account with email verification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label className="text-[10px] font-bold uppercase ml-1">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-zinc-400" size={16} />
                  <Input name="name" value={signupInput.name} onChange={(e) => changeInputHandler(e, "signup")} className={inputClass} placeholder="John Doe" />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-bold uppercase ml-1">Email</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-3 text-zinc-400" size={16} />
                    <Input name="email" value={signupInput.email} onChange={(e) => changeInputHandler(e, "signup")} className={inputClass} placeholder="name@email.com" />
                  </div>
                  <Button disabled={isOtpLoading} type="button" onClick={() => handleOtpRequest(signupInput.email)} variant="secondary" className="rounded-xl text-[10px] font-bold uppercase h-11 dark:bg-zinc-800">
                    {isOtpLoading ? <Loader2 className="animate-spin" size={14} /> : "Get OTP"}
                  </Button>
                </div>
              </div>
              {otpSent && (
                <div className="space-y-1 animate-in slide-in-from-top-2 duration-300">
                  <Label className="text-[10px] font-bold uppercase ml-1 text-blue-600">Verification Code</Label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-3 text-blue-500" size={16} />
                    <Input name="otp" value={signupInput.otp} onChange={(e) => changeInputHandler(e, "signup")} className="pl-10 rounded-xl border-blue-100 dark:border-blue-900 bg-blue-50/10 h-11 dark:text-white" placeholder="Enter 6-digit OTP" />
                  </div>
                </div>
              )}
              <div className="space-y-1">
                <Label className="text-[10px] font-bold uppercase ml-1">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-zinc-400" size={16} />
                  <Input type="password" name="password" value={signupInput.password} onChange={(e) => changeInputHandler(e, "signup")} className={inputClass} placeholder="••••••••" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button disabled={registerLoading || !otpSent} onClick={() => handleSubmit("signup")} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold uppercase tracking-widest text-[10px]">
                {registerLoading ? <Loader2 className="animate-spin" /> : "Verify & Register"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="login">
          <Card className="border-none shadow-2xl rounded-3xl dark:bg-zinc-900">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-black tracking-tight uppercase italic dark:text-white">Welcome<span className="text-blue-600">.</span></CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-1">
                <Label className="text-[10px] font-bold uppercase ml-1">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-zinc-400" size={16} />
                  <Input name="email" value={loginInput.email} onChange={(e) => changeInputHandler(e, "login")} className={inputClass} placeholder="Enter email" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center px-1">
                  <Label className="text-[10px] font-bold uppercase">Password</Label>
                  <button type="button" onClick={() => setActiveTab("forget")} className="text-[10px] font-bold text-blue-600 hover:underline">Forgot Password?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-zinc-400" size={16} />
                  <Input type="password" name="password" value={loginInput.password} onChange={(e) => changeInputHandler(e, "login")} className={inputClass} placeholder="••••••••" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button disabled={loginLoading} onClick={() => handleSubmit("login")} className="w-full h-12 bg-zinc-900 hover:bg-black dark:bg-white dark:text-black rounded-xl font-bold uppercase tracking-widest text-[10px]">
                {loginLoading ? <Loader2 className="animate-spin" /> : "Login Account"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="forget">
          <Card className="border-none shadow-2xl rounded-3xl dark:bg-zinc-900">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-black tracking-tight uppercase italic text-red-600">Recovery</CardTitle>
              <CardDescription className="text-xs">Reset password using OTP</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label className="text-[10px] font-bold uppercase ml-1">Account Email</Label>
                <div className="flex gap-2">
                   <div className="relative flex-1">
                    <Mail className="absolute left-3 top-3 text-zinc-400" size={16} />
                    <Input name="email" value={forgetInput.email} onChange={(e) => changeInputHandler(e, "forget")} className={inputClass} placeholder="Registered email" />
                  </div>
                  <Button disabled={isOtpLoading} type="button" onClick={() => handleOtpRequest(forgetInput.email)} className="rounded-xl text-[10px] font-bold uppercase h-11 dark:bg-zinc-800">
                    OTP
                  </Button>
                </div>
              </div>
              {otpSent && (
                <>
                  <div className="space-y-1 animate-in zoom-in duration-300">
                    <Label className="text-[10px] font-bold uppercase ml-1">Verification OTP</Label>
                    <Input name="otp" value={forgetInput.otp} onChange={(e) => changeInputHandler(e, "forget")} className="rounded-xl border-red-100 dark:border-red-900 bg-red-50/10 h-11 dark:text-white px-4" placeholder="6-digit code" />
                  </div>
                  <div className="space-y-1 animate-in zoom-in duration-300">
                    <Label className="text-[10px] font-bold uppercase ml-1">New Password</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-3 text-zinc-400" size={16} />
                      <Input type="password" name="newPassword" value={forgetInput.newPassword} onChange={(e) => changeInputHandler(e, "forget")} className={inputClass} placeholder="Enter new password" />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter>
              <Button disabled={isResetLoading || !otpSent} onClick={() => handleSubmit("forget")} className="w-full h-12 bg-red-600 hover:bg-red-700 rounded-xl font-bold uppercase tracking-widest text-[10px] text-white transition-all">
                {isResetLoading ? <Loader2 className="animate-spin" /> : "Update Password"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Login;