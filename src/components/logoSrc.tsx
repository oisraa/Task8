import React from 'react';

interface Props {
  logoSrc: string;
}

const SignIn: React.FC<Props> = ({ logoSrc }) => {
  return (
    <div>
      <img src={logoSrc} alt="Logo" />
      {/* Sign-in form code here */}
    </div>
  );
};

export default SignIn;
