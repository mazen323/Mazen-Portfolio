import React from "react";
import { Col, Row } from "react-bootstrap";
import {
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiRedux,
  SiBootstrap,
  SiGraphql,
  SiMysql,
  SiMagento,
} from "react-icons/si";

const stack = [
  { icon: <SiHtml5 />, name: "HTML5" },
  { icon: <SiCss3 />, name: "CSS3" },
  { icon: <SiJavascript />, name: "JavaScript" },
  { icon: <SiTypescript />, name: "TypeScript" },
  { icon: <SiReact />, name: "React.js" },
  { icon: <SiNextdotjs />, name: "Next.js" },
  { icon: <SiRedux />, name: "Redux" },
  { icon: <SiBootstrap />, name: "Bootstrap" },
  { icon: <SiGraphql />, name: "GraphQL" },
  { icon: <SiMagento />, name: "Magento 2" },
  { icon: <SiMysql />, name: "MySQL" },
];

function Techstack() {
  return (
    <Row style={{ justifyContent: "center", paddingBottom: "20px" }}>
      {stack.map((item) => (
        <Col xs={4} md={2} className="tech-icons" key={item.name} title={item.name}>
          {item.icon}
        </Col>
      ))}
    </Row>
  );
}

export default Techstack;
