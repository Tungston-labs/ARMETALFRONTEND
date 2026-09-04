import React from "react";
import { Wrapper, IconImage, Title, Subtitle, RetryButton } from "./ErrorSomething.Styles";
import ErrorSVG from "../../assets/error.svg"; 

function ErrorSomething({ onRetry }) {
  return (
    <Wrapper>
      <IconImage src={ErrorSVG} alt="Error" />

      <Title>Oops! Something went wrong</Title>

      <Subtitle>
       We couldn’t process your request right now.
        Please try again later.
      </Subtitle>
    </Wrapper>
  );
}

export default ErrorSomething;
