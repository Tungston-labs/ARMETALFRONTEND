import styled from "styled-components";

export const ChartContainer = styled.div`
    width: 100%;
    height: 100%;

    min-height: 584px;

    padding: 14px 16px;

    border: 1px solid #e4e4e4;
    border-radius: 5px;

    background: #ffffff;

    box-sizing: border-box;
`;

export const ChartHeader = styled.div`
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-bottom: 12px;
`;

export const ChartTitle = styled.h3`
    margin: 0;

    color: #111111;

    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
`;

export const YearSelect = styled.select`
    width: 68px;
    height: 31px;

    padding: 0 8px;

    border: 1px solid #dedede;
    border-radius: 4px;

    background: #ffffff;

    color: #222222;

    font-family: inherit;
    font-size: 11px;

    outline: none;

    cursor: pointer;
`;

export const ChartBody = styled.div`
    width: 100%;
    height: 510px;

    display: flex;
`;

export const YAxis = styled.div`
    width: 35px;
    height: calc(100% - 30px);

    flex-shrink: 0;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    padding-top: 7px;
    padding-bottom: 3px;

    box-sizing: border-box;
`;

export const YAxisValue = styled.span`
    color: #222222;

    font-size: 10px;
    font-weight: 400;

    white-space: nowrap;
`;

export const ChartContent = styled.div`
    position: relative;

    flex: 1;

    height: 100%;

    padding-bottom: 30px;

    box-sizing: border-box;
`;

export const GridLines = styled.div`
    position: absolute;

    top: 7px;
    right: 0;
    left: 36px;
    bottom: 30px;

    display: flex;

    pointer-events: none;
`;

export const GridLine = styled.span`
    flex: 1;

    border-left: 1px solid #eeeeee;

    &:last-child {
        border-right: 1px solid #eeeeee;
    }
`;

export const ChartRow = styled.div`
    position: relative;

    width: 100%;
    height: 45px;

    display: flex;
    align-items: center;

    z-index: 2;
`;

export const MonthLabel = styled.span`
    width: 36px;

    flex-shrink: 0;

    color: #202020;

    font-size: 11px;
    font-weight: 400;
`;

export const BarArea = styled.div`
    position: relative;

    flex: 1;

    height: 100%;

    display: flex;
    align-items: center;
`;

export const Bar = styled.div`
    height: 19px;

    min-width: 10px;

    border-radius: 10px;

    background: ${(props) =>
        props.active ? "#008f0c" : "#3154b5"};

    transition:
        width 0.2s ease,
        opacity 0.2s ease;

    cursor: pointer;

    &:hover {
        opacity: 0.85;
    }
`;

export const Tooltip = styled.div`
    position: absolute;

    left: 65%;
    top: -43px;

    min-width: 106px;

    padding: 8px 10px;

    border-radius: 7px;

    background: #ffffff;

    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.13);

    z-index: 20;

    box-sizing: border-box;

    &::after {
        content: "";

        position: absolute;

        left: 20px;
        bottom: -5px;

        width: 10px;
        height: 10px;

        background: #ffffff;

        transform: rotate(45deg);
    }
`;

export const TooltipTitle = styled.div`
    margin-bottom: 3px;

    color: #171717;

    font-size: 10px;
    font-weight: 400;
`;

export const TooltipValue = styled.div`
    color: #202020;

    font-size: 11px;
    font-weight: 500;
`;

export const XAxis = styled.div`
    position: absolute;

    left: 36px;
    right: 0;
    bottom: 0;

    height: 24px;

    display: flex;
    align-items: center;
    justify-content: space-between;
`;

export const XAxisValue = styled.span`
    color: #202020;

    font-size: 10px;
    font-weight: 400;
`;