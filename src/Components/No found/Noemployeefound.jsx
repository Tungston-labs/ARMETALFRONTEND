import React from "react";
import styled, { keyframes } from "styled-components";

// ---------- Animations ----------
const floatUp = keyframes`
  0%   { transform: translateY(0px); }
  50%  { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.35; }
  50%       { opacity: 0.7; }
`;

// ---------- Styled Components ----------
export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  min-height: 380px;
  width: 100%;
  animation: ${fadeIn} 0.45s ease both;
`;

export const IllustrationWrap = styled.div`
  animation: ${floatUp} 3.5s ease-in-out infinite;
  margin-bottom: 32px;
`;

export const CircleBg = styled.div`
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background: #f0f4ff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    inset: -6px;
    border-radius: 50%;
    border: 2px dashed #c7d5f8;
    animation: ${pulse} 2.5s ease-in-out infinite;
  }
`;

export const EmojiIcon = styled.span`
  font-size: 56px;
  line-height: 1;
  user-select: none;
`;

export const Title = styled.h3`
  margin: 0 0 10px;
  font-size: 20px;
  font-weight: 700;
  color: #1e2a45;
  letter-spacing: -0.3px;
  text-align: center;
`;

export const Subtitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: #7a8aaa;
  text-align: center;
  max-width: 280px;
  line-height: 1.6;
`;

export const SearchTerm = styled.span`
  font-weight: 600;
  color: #3b6ef8;
`;

export const ShadowLine = styled.div`
  width: 80px;
  height: 6px;
  border-radius: 50%;
  background: #e4eaf8;
  margin-top: 28px;
  animation: ${pulse} 3s ease-in-out infinite;
`;

// ---------- Component ----------
/**
 * Generic "no records" empty state — usable for employees, companies,
 * departments, or any other list.
 *
 * Examples:
 *   <NoRecordsFound entityLabel="employees" searchTerm={debouncedSearch} />
 *   <NoRecordsFound entityLabel="companies" searchTerm={search} />
 *   <NoRecordsFound entityLabel="departments" />
 */
const NoRecordsFound = ({
  entityLabel = "records",
  searchTerm = "",
  icon = "🔍",
  title,
  emptyMessage,
}) => {
  const resolvedTitle = title || `No ${entityLabel} found`;
  const resolvedEmptyMessage =
    emptyMessage ||
    `No ${entityLabel} match your current search or filter. Try adjusting your query.`;

  return (
    <Wrapper>
      <IllustrationWrap>
        <CircleBg>
          <EmojiIcon>{icon}</EmojiIcon>
        </CircleBg>
      </IllustrationWrap>

      <Title>{resolvedTitle}</Title>

      <Subtitle>
        {searchTerm ? (
          <>
            We couldn't find any {entityLabel} matching{" "}
            <SearchTerm>"{searchTerm}"</SearchTerm>. Try a different search.
          </>
        ) : (
          resolvedEmptyMessage
        )}
      </Subtitle>

      <ShadowLine />
    </Wrapper>
  );
};

export default NoRecordsFound;