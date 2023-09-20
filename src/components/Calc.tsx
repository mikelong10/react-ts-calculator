import { useState } from "react";
import Input from "./Input";

export default function Calc() {
  const [clearStatus, setClearStatus] = useState("AC");
  const [prevOutput, setPrevOutput] = useState("");
  const [curOutput, setCurOutput] = useState("");
  const [afterOp, setAfterOp] = useState(false);

  // handle when clear button is pressed
  function clear(clearStatus: string) {
    if (clearStatus === "AC") {
      setPrevOutput("");
      setCurOutput("");
      setAfterOp(false);
    } else {
      setClearStatus("AC");
      setCurOutput("");
      setAfterOp(false);
    }
  }

  function enterNumber(value: number | string) {
    let curOutputProcess = curOutput;
    if (afterOp) {
      curOutputProcess = "";
    }
    let newCurOutput = curOutputProcess;
    if (!(newCurOutput && newCurOutput.includes(".") && value === ".")) {
      setClearStatus("C");
      newCurOutput = curOutputProcess + value;
      console.log(newCurOutput);
      if (newCurOutput === ".") {
        newCurOutput = "0.";
      }
      if (
        newCurOutput.length > 1 &&
        newCurOutput.substring(0, 1) === "0" &&
        value !== "." &&
        newCurOutput.substring(0, 2) !== "0."
      ) {
        newCurOutput = newCurOutput.substring(1);
      }
    }
    if (newCurOutput && newCurOutput.length > 9) {
      setCurOutput(newCurOutput.substring(0, 9));
    } else {
      setCurOutput(newCurOutput);
    }
    setAfterOp(false);
  }

  function doOperation(operation: string) {
    if (prevOutput && curOutput) {
      const val = evaluate();
      if (val) {
        setPrevOutput(val.concat(" ", operation));
        setCurOutput("");
        setClearStatus("AC");
        setAfterOp(true);
      }
    } else if (curOutput) {
      setPrevOutput(curOutput.concat(" ", operation));
      setCurOutput("");
      setClearStatus("AC");
      setAfterOp(false);
    }
  }

  function evaluate() {
    if (prevOutput && curOutput) {
      const expression = prevOutput.concat(" ", curOutput).split(" ");
      setPrevOutput("");
      setAfterOp(true);
      // actually do the math
      const [firstVal, operation, secondVal] = expression;
      return doMath(firstVal, operation, secondVal);
    }
  }

  // to toggle the sign (positive/negative) of the current number
  function toggleSign() {
    if (curOutput) {
      setCurOutput((Number(curOutput) * -1).toString());
      setAfterOp(true);
    }
  }

  // calculate percentage version of the current output
  function percentize() {
    if (curOutput) {
      doMath(curOutput, "*", "100");
      setAfterOp(true);
    }
  }

  function doMath(firstVal: string, operation: string, secondVal: string) {
    let evaluation;
    if (operation === "+") {
      evaluation = parseFloat(firstVal) + parseFloat(secondVal);
    } else if (operation === "–" || operation === "-") {
      evaluation = parseFloat(firstVal) - parseFloat(secondVal);
    } else if (operation === "x" || operation === "*") {
      evaluation = parseFloat(firstVal) * parseFloat(secondVal);
    } else if (operation === "÷" || operation === "/") {
      evaluation = parseFloat(firstVal) / parseFloat(secondVal);
    }
    if (evaluation) {
      const answer = evaluation.toString();
      console.log(answer);
      let nextOutput;
      if (
        (answer.includes(".") &&
          answer.split(".")[1].substring(0, 5) === "99999") ||
        (answer.includes(".") &&
          answer.split(".")[1].substring(0, 5) === "00000")
      ) {
        nextOutput = Math.round(evaluation).toString();
      } else if (answer.length > 9) {
        let truncate = answer;
        if (answer.includes(".")) {
          const numDecPlaces = 9 - answer.split(".")[0].length - 1;
          const roundFactor = Math.pow(10, numDecPlaces);
          // Round evaluation
          const rounded = Math.round(evaluation * roundFactor) / roundFactor;
          console.log(rounded);
          // Return the number as a string
          truncate = rounded.toString();
        }
        nextOutput = parseFloat(truncate.substring(0, 9)).toString();
      } else {
        nextOutput = answer;
      }
      setCurOutput(nextOutput);
      return nextOutput;
    }
  }

  return (
    <div className="calc">
      <div className="output">
        <div className="prev">{prevOutput}</div>
        <div className="current">{curOutput}</div>
      </div>
      <div className="inputs">
        <div className="left">
          <div className="misc">
            <Input value={clearStatus} onClick={() => clear(clearStatus)} />
            <Input value={"±"} onClick={toggleSign} />
            <Input value={"%"} onClick={percentize} />
          </div>
          <div className="numbers">
            {[
              [7, 8, 9],
              [4, 5, 6],
              [1, 2, 3],
            ].map((row) => (
              <div className="row">
                {row.map((num) => (
                  <Input
                    value={num}
                    inputType={"digit"}
                    onClick={() => enterNumber(num)}
                  />
                ))}
              </div>
            ))}
            <div className="row">
              <Input
                value={0}
                inputType={"digit"}
                onClick={() => enterNumber("0")}
              />
              <Input
                value={"."}
                inputType={"decimal"}
                onClick={() => enterNumber(".")}
              />
            </div>
          </div>
        </div>
        <div className="right">
          <div className="operations">
            <Input
              value={"÷"}
              inputType={"operation"}
              onClick={() => doOperation("÷")}
            />
            <Input
              value={"x"}
              inputType={"operation"}
              onClick={() => doOperation("x")}
            />
            <Input
              value={"–"}
              inputType={"operation"}
              onClick={() => doOperation("–")}
            />
            <Input
              value={"+"}
              inputType={"operation"}
              onClick={() => doOperation("+")}
            />
            <Input value={"="} inputType={"operation"} onClick={evaluate} />
          </div>
        </div>
      </div>
    </div>
  );
}
