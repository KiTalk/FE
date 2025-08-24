import React from "react";
import { usePhoneInput } from "../hooks/usePhoneInput";
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
} from "./PhoneInput.styles";

/**
 * 재사용 가능한 전화번호 입력 컴포넌트
 * @param {object} props
 * @param {string} props.title - 페이지 제목
 * @param {string} props.subtitle - 페이지 부제목
 * @param {string} props.inputHeading - 입력 영역 제목
 * @param {string} props.instruction - 입력 안내 텍스트
 * @param {string} props.errorMessage - 에러 메시지 (있을 경우 instruction 대신 표시)
 * @param {string} props.saveButtonText - 저장 버튼 텍스트
 * @param {function} props.onSave - 저장 버튼 클릭 핸들러
 * @param {object} props.phoneInputOptions - usePhoneInput 훅 옵션
 * @returns {JSX.Element}
 */
export default function PhoneInput({
  title = "전화번호로 간편 주문",
  subtitle = "전화번호 입력시 '자주 주문한 메뉴'를 확인할 수 있습니다",
  inputHeading = "전화번호 입력",
  instruction = "오른쪽 숫자 패드에서 전화번호 입력 후 저장을 눌러주세요",
  errorMessage = null,
  saveButtonText = "저장",
  onSave,
  phoneInputOptions = {},
  children,
}) {
  const { formatted, canSave, cleanDigits, handleKeypadClick } =
    usePhoneInput(phoneInputOptions);

  const handleSave = () => {
    if (!canSave) return;
    if (typeof onSave === "function") {
      onSave(cleanDigits);
    }
  };

  return (
    <Page>
      <Title>{title}</Title>
      <Subtitle>{subtitle}</Subtitle>

      <Panel>
        <InputArea>
          <InputHeading>{inputHeading}</InputHeading>

          <PhoneRow>
            <Segment slot="head">{formatted.head}</Segment>
            <Hyphen $index={1} />
            <Segment slot="mid">{formatted.mid || ""}</Segment>
            <Hyphen $index={2} />
            <Segment slot="tail">{formatted.tail || ""}</Segment>
            <BottomAccent />
          </PhoneRow>

          <Instruction
            $isError={!!errorMessage}
            dangerouslySetInnerHTML={{
              __html: errorMessage || instruction,
            }}
          />
        </InputArea>

        <Keypad>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <KeyButton key={n} data-num={n} onClick={handleKeypadClick}>
              {n}
            </KeyButton>
          ))}
          <KeyButton
            $variant="action"
            data-action="backspace"
            onClick={handleKeypadClick}
          >
            지우기
          </KeyButton>
          <KeyButton data-num="0" onClick={handleKeypadClick}>
            0
          </KeyButton>
          <SaveButton onClick={handleSave} disabled={!canSave}>
            {saveButtonText}
          </SaveButton>
        </Keypad>
      </Panel>

      {/* 추가 콘텐츠를 위한 children 슬롯 */}
      {children}
    </Page>
  );
}
