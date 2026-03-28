import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { signIn } from "../../controllers/auth.controller";
import { useNavigate } from "react-router-dom";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";


const Signin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigator = useNavigate();



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await signIn({ email, password });
           
            toast.success(res.data.message || "Signin successful");

            setEmail("");
            setPassword("");
            navigator("/dashboard");
        } catch (error: any) {
            if (error.response) {
                toast.error(error.response?.data?.message || "Signin first");
            } else {
                console.error(error);
                toast.error("Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 ">

            <div className="w-full max-w-md space-y-4 border rounded-xl shadow-lg p-6 bg-white ">
                <h1 className="text-2xl text-center">Signin</h1>
                <form onSubmit={handleSubmit} className="space-y-2">
                    <div>
                        <Label>Email</Label>
                        <Input value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div>
                        <Label>Password</Label>
                        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <Field>
                        <div className="flex items-center">
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline" >
                                Forgot your password?
                            </a>
                        </div>
                    </Field>
                    <Button type="submit" className="w-full">
                        {loading && <Spinner />}
                        Signin</Button>
                    <Field>
                        {/* <Button type="submit">Login</Button> */}
                        <FieldDescription className="text-center">
                            Don&apos;t have an account? <a href="/signup">Sign up</a>
                        </FieldDescription>
                    </Field>
                </form>
            </div>
        </div>
    );
};

export default Signin;