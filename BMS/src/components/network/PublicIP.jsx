import { useState, useEffect } from "react";
const PublickIP = () => {
  const [ip, setIp] = useState("");

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setIp(data.ip))
      .catch((err) => {
        console.error("IP 가져오기 실패:", err);
        setIp("불러오기 실패");
      });
  }, []);

  return <span>{ip || "불러오는 중..."}</span>;
};

export default PublickIP;
