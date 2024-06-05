import React, { useState } from "react";
import Heading from "../components/Heading";
import SubHeading from "../components/SubHeading";
import Button from "../components/Button";
import InputBox from "../components/InputBox";
import BottomWarning from "../components/BottomWarning";
import axios from 'axios';
import { useNavigate } from "react-router-dom"

const Signup = () => {

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const registerUser = async () => {
    try {
      const response = await axios.post("http://localhost:11000/api/v1/user/signup", {
        username,
        password,
        firstname,
        lastname,
      });

      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign up"} />
          <SubHeading label={"Enter your infromation to create an account"} />
          <InputBox placeholder="Mayuresh" label={"First Name"} onChange={(e) => {
            setFirstname(e.target.value);
          }} />
          <InputBox placeholder="Pitambare" label={"Last Name"} onChange={(e) => {
            setLastname(e.target.value);
          }}/>
          <InputBox placeholder="mayureshp@gmail.com" label={"Email"} onChange={(e) => {
            setUsername(e.target.value);
          }}/>
          <InputBox placeholder="123456" label={"Password"} onChange={(e) => {
            setPassword(e.target.value);
          }}/>
          <div className="pt-4">
            <Button label={"Sign up"} onClick={registerUser}/>
          </div>
          <BottomWarning
            label={"Already have an account?"}
            buttonText={"Sign in"}
            to={"/signin"}
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
