import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { api } from "../../services/api.service";
import { useNavigate } from "react-router-dom";
import { Field, FieldLabel } from "@/components/ui/field"
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);



  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/signup", { name, email, password });
      toast.success(res.data.message || "Signup successful");
      setName("");
      setEmail("");
      setPassword("");
      navigate("/");
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        console.error(error);
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="space-y-6 w-96 border p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Signup</h1>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <Field>
            <div className="flex items-center">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <a
                href="#"
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </a>
            </div>
          </Field>
          <Button type="submit" className="w-full mt-4">
            {/* click krne pr true ho jaye  */}
            {loading && <Spinner />}
            Signup
          </Button>

          <p className="text-center text-sm">
            Already have an account?{" "}
            <a href="/" className="text-blue-500 underline">
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;