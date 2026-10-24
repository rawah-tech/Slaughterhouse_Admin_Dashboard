import React, { useEffect, useRef } from "react";
import Chartist from "chartist";

const DATA_POINT_SELECTOR = [
  ".ct-point",
  ".ct-bar",
  ".ct-slice-pie",
  ".ct-slice-donut",
  ".ct-slice-donut-solid",
].join(",");

const Chart = ({ type, data, options, className = "" }) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const ChartType = Chartist[type];

    if (!elementRef.current || typeof ChartType !== "function") {
      return undefined;
    }

    const container = elementRef.current;
    const chart = new ChartType(container, data, options);
    const tooltip = document.createElement("div");
    tooltip.className = "chartist-tooltip";
    tooltip.setAttribute("role", "status");
    document.body.appendChild(tooltip);

    const findDataPoint = (target) => {
      const point = target instanceof Element
        ? target.closest(DATA_POINT_SELECTOR)
        : null;

      return point && container.contains(point) ? point : null;
    };

    const positionTooltip = (event) => {
      const bounds = tooltip.getBoundingClientRect();
      tooltip.style.left = `${event.pageX - bounds.width / 2}px`;
      tooltip.style.top = `${event.pageY - bounds.height - 20}px`;
    };

    const handleMouseOver = (event) => {
      const point = findDataPoint(event.target);
      if (!point) return;

      const value = point.getAttribute("ct:value") ?? "";
      const meta =
        point.getAttribute("ct:meta") ??
        point.parentElement?.getAttribute("ct:series-name") ??
        "";

      tooltip.textContent = [meta, value].filter(Boolean).join(": ");
      if (!tooltip.textContent) return;

      tooltip.classList.add("tooltip-show");
      positionTooltip(event);
    };

    const handleMouseMove = (event) => {
      if (tooltip.classList.contains("tooltip-show")) {
        positionTooltip(event);
      }
    };

    const handleMouseOut = (event) => {
      if (findDataPoint(event.target)) {
        tooltip.classList.remove("tooltip-show");
      }
    };

    container.addEventListener("mouseover", handleMouseOver);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseout", handleMouseOut);

    return () => {
      container.removeEventListener("mouseover", handleMouseOver);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseout", handleMouseOut);
      tooltip.remove();
      chart.detach();
    };
  }, [data, options, type]);

  return <div ref={elementRef} className={className} role="img" aria-label="مخطط بيانات" />;
};

export default Chart;
