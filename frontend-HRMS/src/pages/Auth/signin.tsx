import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { signIn } from "../../controllers/auth.controller";
import { Link, useNavigate } from "react-router-dom";
import { Field, FieldDescription } from "@/components/ui/field"
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/pages/context/AuthContext";
import axios from "axios";


const Signin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigator = useNavigate();
    const { fetchUser } = useAuth();



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await signIn({ email, password });

            toast.success(res.data.message || "Signin successful");

            await fetchUser();

            navigator("/dashboard");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Error");
            } else {
                console.error(error);
                toast.error("Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className=" bg-card min-h-screen flex items-center justify-center ">

            <div className="bg-card w-full max-w-md space-y-4 border rounded-xl shadow-lg p-6 ">
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
                            <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline" >
                                Forgot your password?
                            </a>
                        </div>
                    </Field>
                    <Button type="submit" className=" cursor-pointer w-full">
                        {loading && <Spinner />}
                        Signin</Button>
                    <Field>
                        {/* <Button type="submit">Login</Button> */}
                        <FieldDescription className="text-center">
                            Don&apos;t have an account? <Link to="/signup">Sign up</Link>
                        </FieldDescription>
                    </Field>
                </form>
            </div>
        </div>
    );
};

export default Signin;