import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import { saveOrderPoint } from "../utils/orderSpec";
import {
  Page,
  Title,
  Subtitle,
  Panel,
  InputArea,
  InputHeading,
  Instruction,
  PhoneRow,
  BottomAccent,
  Segment,
  Hyphen,
  Keypad,
  KeyButton,
  SaveButton,
} from "./PointPhone.styles";

export default function PointPhone() {
  const navigate = useNavigate();
  const [digits, setDigits] = useState("010");

  const formatted = useMemo(() => {
    const onlyNums = digits.replace(/\D/g, "");
    const head = "010";
    const rest = onlyNums.startsWith("010") ? onlyNums.slice(3) : onlyNums;
    const mid = rest.slice(0, 4);
    const tail = rest.slice(4, 8);
    return { head, mid, tail };
  }, [digits]);

  function handleDigit(d) {
    setDigits((prev) => {
      const cleaned = prev.replace(/\D/g, "");
      if (cleaned.length >= 11) return prev;
      return (cleaned + String(d)).replace(/\D/g, "");
    });
  }

  function handleBackspace() {
    setDigits((prev) => {
      const cleaned = prev.replace(/\D/g, "");
      if (cleaned.length <= 3) return prev;
      return cleaned.slice(0, -1);
    });
  }

  const canSave = useMemo(() => {
    const len = digits.replace(/\D/g, "").length;
    return len === 11;
  }, [digits]);

  function handleSave() {
    if (!canSave) return;
    try {
      const phone = digits.replace(/\D/g, "");
      saveOrderPoint({ phone });
      navigate("/order/complete", { replace: true });
    } catch (error) {
      console.error(error);
    }
  }

  function handleGoBack() {
    navigate(-1);
  }

  function handleKeyClick(event) {
    const btn = event.currentTarget;
    const action = btn.getAttribute("data-action");
    const numAttr = btn.getAttribute("data-num");
    if (action === "backspace") {
      handleBackspace();
      return;
    }
    if (numAttr != null) {
      handleDigit(Number(numAttr));
    }
  }

  return (
    <Page>
      <Title>전화번호로 간편 주문</Title>
      <Subtitle>
        전화번호 입력시 ‘자주 주문한 메뉴’를 확인할 수 있습니다
      </Subtitle>

      <Panel>
        <InputArea>
          <InputHeading>전화번호 입력</InputHeading>

          <PhoneRow>
            <Segment slot="head">{formatted.head}</Segment>
            <Hyphen index={1} />
            <Segment slot="mid">{formatted.mid || ""}</Segment>
            <Hyphen index={2} />
            <Segment slot="tail">{formatted.tail || ""}</Segment>
            <BottomAccent />
          </PhoneRow>

          <Instruction>
            오른쪽 숫자 패드에서 전화번호 입력 후 <br /> 저장을 눌러주세요
          </Instruction>
        </InputArea>

        <Keypad>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <KeyButton key={n} data-num={n} onClick={handleKeyClick}>
              {n}
            </KeyButton>
          ))}
          <KeyButton
            variant="action"
            data-action="backspace"
            onClick={handleKeyClick}
          >
            지우기
          </KeyButton>
          <KeyButton data-num="0" onClick={handleKeyClick}>
            0
          </KeyButton>
          <SaveButton onClick={handleSave} disabled={!canSave}>
            저장
          </SaveButton>
        </Keypad>
      </Panel>

      <BackButton onClick={handleGoBack} />
    </Page>
  );
}
