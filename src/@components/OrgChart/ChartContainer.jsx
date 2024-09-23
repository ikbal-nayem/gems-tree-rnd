import html2canvas from "html2canvas";
import JSONDigger from "json-digger";
import PropTypes from "prop-types";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import "./ChartContainer.css";
import ChartNode from "./ChartNode";
import { selectNodeService } from "./service";
import { Icon } from "@gems/components";

const propTypes = {
  datasource: PropTypes.object.isRequired,
  pan: PropTypes.bool,
  zoom: PropTypes.bool,
  zoomoutLimit: PropTypes.number,
  zoominLimit: PropTypes.number,
  containerClass: PropTypes.string,
  chartClass: PropTypes.string,
  NodeTemplate: PropTypes.elementType,
  draggable: PropTypes.bool,
  collapsible: PropTypes.bool,
  multipleSelect: PropTypes.bool,
  onClickNode: PropTypes.func,
  onClickChart: PropTypes.func,
  exportPDF: PropTypes.func,
  // headerData:PropTypes.elementType
};

const defaultProps = {
  pan: false,
  zoom: false,
  zoomoutLimit: 0.5,
  zoominLimit: 3,
  containerClass: "",
  chartClass: "",
  draggable: false,
  collapsible: false,
  multipleSelect: false,
};

const ChartContainer = forwardRef(
  (
    {
      datasource,
      pan,
      zoom,
      zoomoutLimit,
      zoominLimit,
      containerClass,
      chartClass,
      NodeTemplate,
      draggable,
      collapsible,
      multipleSelect,
      onClickNode,
      onClickChart,
      exportPDF,
      headerData,
    },
    ref
  ) => {
    const container = useRef();
    const chart = useRef();
    const downloadButton = useRef();

    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [transform, setTransform] = useState("");
    const [panning, setPanning] = useState(false);
    const [cursor, setCursor] = useState("default");
    const [exporting, setExporting] = useState(false);
    const [dataURL, setDataURL] = useState("");
    const [download, setDownload] = useState("");

    const attachRel = (data, flags) => {
      data.relationship =
        flags + (data.children && data.children.length > 0 ? 1 : 0);
      if (data.children) {
        data.isLastNode = data.children
          .map((d) => !d?.children?.length)
          .every((v) => v);
        data.children.forEach(function (item) {
          attachRel(item, "1" + (data.children.length > 1 ? 1 : 0));
        });
      }
      return data;
    };

    const [ds, setDS] = useState(datasource);
    useEffect(() => {
      setDS(datasource);
    }, [datasource]);

    const dsDigger = new JSONDigger(datasource, "id", "children");

    const clickChartHandler = (event) => {
      if (!event.target.closest(".oc-node")) {
        if (onClickChart) {
          onClickChart();
        }
        selectNodeService.clearSelectedNodeInfo();
      }
    };

    const panEndHandler = () => {
      setPanning(false);
      setCursor("default");
    };

    const panHandler = (e) => {
      let newX = 0;
      let newY = 0;
      if (!e.targetTouches) {
        // pand on desktop
        newX = e.pageX - startX;
        newY = e.pageY - startY;
      } else if (e.targetTouches.length === 1) {
        // pan on mobile device
        newX = e.targetTouches[0].pageX - startX;
        newY = e.targetTouches[0].pageY - startY;
      } else if (e.targetTouches.length > 1) {
        return;
      }
      if (transform === "") {
        if (transform.indexOf("3d") === -1) {
          setTransform("matrix(1,0,0,1," + newX + "," + newY + ")");
        } else {
          setTransform(
            "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0," + newX + ", " + newY + ",0,1)"
          );
        }
      } else {
        let matrix = transform.split(",");
        if (transform.indexOf("3d") === -1) {
          matrix[4] = newX;
          matrix[5] = newY + ")";
        } else {
          matrix[12] = newX;
          matrix[13] = newY;
        }
        setTransform(matrix.join(","));
      }
    };

    const panStartHandler = (e) => {
      if (e.target.closest(".oc-node")) {
        setPanning(false);
        return;
      } else {
        setPanning(true);
        setCursor("move");
      }
      let lastX = 0;
      let lastY = 0;
      if (transform !== "") {
        let matrix = transform.split(",");
        if (transform.indexOf("3d") === -1) {
          lastX = parseInt(matrix[4]);
          lastY = parseInt(matrix[5]);
        } else {
          lastX = parseInt(matrix[12]);
          lastY = parseInt(matrix[13]);
        }
      }
      if (!e.targetTouches) {
        // pand on desktop
        setStartX(e.pageX - lastX);
        setStartY(e.pageY - lastY);
      } else if (e.targetTouches.length === 1) {
        // pan on mobile device
        setStartX(e.targetTouches[0].pageX - lastX);
        setStartY(e.targetTouches[0].pageY - lastY);
      } else if (e.targetTouches.length > 1) {
        return;
      }
    };

    const updateChartScale = (newScale) => {
      let matrix = [];
      let targetScale = 1;
      if (transform === "") {
        setTransform("matrix(" + newScale + ", 0, 0, " + newScale + ", 0, 0)");
      } else {
        matrix = transform.split(",");
        if (transform.indexOf("3d") === -1) {
          targetScale = Math.abs(window.parseFloat(matrix[3]) * newScale);
          if (targetScale > zoomoutLimit && targetScale < zoominLimit) {
            matrix[0] = "matrix(" + targetScale;
            matrix[3] = targetScale;
            setTransform(matrix.join(","));
          }
        } else {
          targetScale = Math.abs(window.parseFloat(matrix[5]) * newScale);
          if (targetScale > zoomoutLimit && targetScale < zoominLimit) {
            matrix[0] = "matrix3d(" + targetScale;
            matrix[5] = targetScale;
            setTransform(matrix.join(","));
          }
        }
      }
    };

    const zoomHandler = (e) => {
      console.log(e);
      let newScale = 1.1 + (e > 0 ? -0.2 : 0.02);
      console.log("test", newScale);
      updateChartScale(newScale);
    };

    // const exportPDF = (canvas, exportFilename) => {
    // 	const canvasWidth = Math.floor(canvas.width);
    // 	const canvasHeight = Math.floor(canvas.height);
    // 	const canW = canvasWidth > canvasHeight ? canvasWidth : canvasHeight;
    // 	const canH = canvasWidth > canvasHeight ? canvasHeight : canvasWidth;
    // 	const doc = new jsPDF({
    // 		orientation: canvasWidth > canvasHeight ? 'landscape' : 'portrait',
    // 		unit: 'px',
    // 		format: [canW, canH],
    // 	});
    // 	doc.addImage(canvas.toDataURL('image/jpeg', 1.0), 'PNG', 0, 0, canW, canH);
    // 	doc.save(exportFilename + '.pdf');
    // };

    const exportPNG = (canvas, exportFilename) => {
      const isWebkit = "WebkitAppearance" in document.documentElement.style;
      const isFf = !!window.sidebar;
      const isEdge =
        navigator.appName === "Microsoft Internet Explorer" ||
        (navigator.appName === "Netscape" &&
          navigator.appVersion.indexOf("Edge") > -1);

      if ((!isWebkit && !isFf) || isEdge) {
        window.navigator.msSaveBlob(canvas.msToBlob(), exportFilename + ".png");
      } else {
        setDataURL(canvas.toDataURL());
        setDownload(exportFilename + ".png");
        downloadButton.current.click();
      }
    };

    const changeHierarchy = async (draggedItemData, dropTargetId) => {
      await dsDigger.removeNode(draggedItemData.id);
      await dsDigger.addChildren(dropTargetId, draggedItemData);
      setDS({ ...dsDigger.ds });
    };

    useImperativeHandle(ref, () => ({
      exportTo: (exportFilename, exportFileextension) => {
        exportFilename = exportFilename || "OrgChart";
        exportFileextension = exportFileextension || "png";
        // setExporting(true);
        const originalScrollLeft = container.current.scrollLeft;
        container.current.scrollLeft = 0;
        const originalScrollTop = container.current.scrollTop;
        container.current.scrollTop = 0;
        html2canvas(chart.current, {
          scale: 1.5,
          onclone: function (clonedDoc) {
            clonedDoc.querySelector(".orgchart").style.background = "none";
            clonedDoc.querySelector(".orgchart").style.transform = "";
          },
        }).then(
          (canvas) => {
            if (exportFileextension.toLowerCase() === "pdf") {
              exportPDF(canvas, exportFilename);
            } else {
              exportPNG(canvas, exportFilename);
            }
            setExporting(false);
            container.current.scrollLeft = originalScrollLeft;
            container.current.scrollTop = originalScrollTop;
          },
          () => {
            setExporting(false);
            container.current.scrollLeft = originalScrollLeft;
            container.current.scrollTop = originalScrollTop;
          }
        );
      },
      expandAllNodes: () => {
        chart.current
          .querySelectorAll(
            ".oc-node.hidden, .oc-hierarchy.hidden, .isSiblingsCollapsed, .isAncestorsCollapsed"
          )
          .forEach((el) => {
            el.classList.remove(
              "hidden",
              "isSiblingsCollapsed",
              "isAncestorsCollapsed"
            );
          });
      },
    }));

    return (
      <div className="position-relative">
        <div
          ref={container}
          className={"orgchart-container " + containerClass}
          onMouseUp={pan && panning ? panEndHandler : undefined}
        >
          <div
            ref={chart}
            className={"orgchart " + chartClass}
            style={{ transform: transform, cursor: cursor }}
            onClick={clickChartHandler}
            onMouseDown={pan ? panStartHandler : undefined}
            onMouseMove={pan && panning ? panHandler : undefined}
          >
            <div
              className="mb-6 treeTitle text-center"
              style={{ height: 0, overflow: "hidden" }}
            >
              {headerData?.organizationHeader && (
                <p className="fs-2 mb-0">
                  {headerData?.organizationHeader || null}
                </p>
              )}
              {headerData?.organizationHeaderMsc && (
                <p className="fs-2 mb-0">
                  {headerData?.organizationHeaderMsc || null}
                </p>
              )}
              <p className="fs-2 mb-0">
                {headerData?.orgName || headerData?.titleName || null}
              </p>
              {headerData?.orgParentName && (
                <p className="fs-2 mb-0">{headerData?.orgParentName || null}</p>
              )}
              <p className="fs-3 mb-0">{headerData?.versionName}</p>
            </div>
            <ul className="justify-content-center">
              <ChartNode
                datasource={attachRel(ds, "00")}
                NodeTemplate={NodeTemplate}
                draggable={draggable}
                collapsible={collapsible}
                multipleSelect={multipleSelect}
                changeHierarchy={changeHierarchy}
                onClickNode={onClickNode}
              />
            </ul>
          </div>

          <a
            className="oc-download-btn hidden"
            ref={downloadButton}
            href={dataURL}
            download={download}
          >
            &nbsp;
          </a>
          <div className={`oc-mask ${exporting ? "" : "hidden"}`}>
            <i className="oci oci-spinner spinner"></i>
          </div>
        </div>
        {zoom && (
          <div className="position-absolute" style={{ top: 5, right: 60 }}>
            <Icon
              icon="zoom_in"
              size={30}
              color="success"
              onClick={() => zoomHandler(-1)}
              variants="outlined"
            />
            <Icon
              icon="zoom_out"
              size={30}
              color="danger"
              variants="outlined"
              onClick={() => zoomHandler(1)}
            />
          </div>
        )}
      </div>
    );
  }
);

ChartContainer.propTypes = propTypes;
ChartContainer.defaultProps = defaultProps;

export { ChartContainer };
