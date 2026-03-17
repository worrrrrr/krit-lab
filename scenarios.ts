import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, RefreshCw, Brain, Target, Shield, User, Ghost, Zap, Activity } from 'lucide-react';

const App = () => {
  const [currentStep, setCurrentStep] = useState('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const scenarios = [
    // --- SET 1: BASE BEHAVIOR (1-10) ---
    {
      title: "ฉากที่ 1: ความผิดปกติในระบบ (The Glitch)",
      context: "คุณกำลังทำงานชิ้นสำคัญที่วางแผนไว้เป็นเดือน แต่จู่ๆ มีปัจจัยภายนอกที่คุณควบคุมไม่ได้ทำให้แผนพังลงทันที",
      options: [
        { text: "วิเคราะห์หาสาเหตุที่แท้จริงและหาทางแก้ที่ยั่งยืน", value: { ti: 2, ni: 2, e5: 2, e1: 1 } },
        { text: "มองหาโอกาสใหม่ๆ หรือทางเลือกอื่นที่สนุกกว่าเดิม", value: { ne: 2, se: 2, e7: 2, e8: 1 } },
        { text: "รู้สึกกังวลและรีบหาที่ยึดเหนี่ยวหรือคนช่วยตัดสินใจ", value: { si: 2, fe: 2, e6: 2, e2: 1 } },
        { text: "ถอยออกมาอยู่กับตัวเองเพื่อจัดการอารมณ์ก่อน", value: { fi: 2, ni: 1, e4: 2, e9: 1 } }
      ]
    },
    {
      title: "ฉากที่ 2: ห้องโถงแห่งการโต้แย้ง (The Conflict)",
      context: "ในวงสนทนา มีคนนำเสนอข้อมูลที่ผิดพลาดอย่างรุนแรง แต่ดูเหมือนทุกคนจะยอมรับมัน",
      options: [
        { text: "ขัดจังหวะทันทีด้วยข้อเท็จจริงที่ถูกต้อง", value: { te: 2, ti: 2, e1: 2, e8: 1 } },
        { text: "รักษาน้ำใจคนพูดไว้ก่อน แล้วค่อยหาจังหวะบอกส่วนตัว", value: { fe: 2, fi: 1, e2: 2, e9: 1 } },
        { text: "เงียบและสังเกตการณ์ว่าทำไมพวกเขาถึงเชื่อแบบนั้น", value: { ni: 2, ti: 2, e5: 2, e4: 1 } },
        { text: "เปลี่ยนประเด็นให้เป็นเรื่องตลกหรือผ่อนคลาย", value: { ne: 2, se: 1, e7: 2, e9: 2 } }
      ]
    },
    {
      title: "ฉากที่ 3: รางวัลแห่งความสำเร็จ (The Achievement)",
      context: "คุณเพิ่งได้รับรางวัลใหญ่จากการทำงานที่หนักหน่วง ความรู้สึกแรกของคุณคือ...",
      options: [
        { text: "ฉันควรจะได้มันนานแล้ว เพราะฉันทำตามเป้าหมาย", value: { te: 2, si: 1, e3: 2, e1: 1 } },
        { text: "ฉันดีใจที่คนรอบข้างเห็นคุณค่าในสิ่งที่ฉันให้", value: { fe: 2, si: 2, e2: 2, e6: 1 } },
        { text: "นี่เป็นเพียงจุดเริ่มต้นของความเป็นไปได้ที่กว้างกว่า", value: { ne: 2, ni: 1, e7: 2, e4: 1 } },
        { text: "ฉันไม่ได้สนใจรางวัลเท่ากับ 'ความเข้าใจ' ที่ได้ระหว่างทาง", value: { ti: 2, fi: 2, e5: 2, e4: 2 } }
      ]
    },
    {
      title: "ฉากที่ 4: ความเงียบในป่าลึก (The Isolation)",
      context: "คุณมีเวลาว่างหนึ่งสัปดาห์เต็มๆ โดยไม่มีใครรบกวน คุณจะใช้มันอย่างไร",
      options: [
        { text: "วางแผนเรียนรู้ทักษะใหม่หรือเจาะลึกทฤษฎีที่สนใจ", value: { ti: 2, ni: 2, e5: 2, e1: 1 } },
        { text: "ออกไปผจญภัยในที่ที่ไม่เคยไปเพื่อรับประสบการณ์", value: { se: 2, ne: 2, e7: 2, e8: 1 } },
        { text: "พักผ่อนแบบสบายๆ ทำกิจกรรมที่คุ้นเคยและปลอดภัย", value: { si: 2, fi: 1, e9: 2, e6: 1 } },
        { text: "ใช้เวลาตกผลึกกับความรู้สึกและสร้างสรรค์งานศิลปะ", value: { fi: 2, ni: 2, e4: 2, e5: 1 } }
      ]
    },
    {
      title: "ฉากที่ 5: หน้ากากสังคม (The Social Filter)",
      context: "คุณอยู่ในงานปาร์ตี้ที่มีแต่คนแปลกหน้า บทบาทที่คุณมักจะทำคือ...",
      options: [
        { text: "เป็นผู้นำบทสนทนาและทำให้บรรยากาศสนุกสนาน", value: { fe: 2, se: 2, e3: 2, e7: 1 } },
        { text: "ยืนอยู่มุมห้อง คุยเฉพาะกับคนที่ดูน่าสนใจ", value: { ni: 2, ti: 1, e5: 2, e4: 1 } },
        { text: "ช่วยงานจิปาถะในงานเพื่อให้ตัวเองมีอะไรทำ", value: { si: 2, fe: 2, e6: 2, e2: 1 } },
        { text: "วิจารณ์สถานการณ์ในใจ และหาทางกลับบ้านให้เร็วที่สุด", value: { te: 1, ti: 2, e1: 2, e8: 1 } }
      ]
    },
    {
      title: "ฉากที่ 6: การตัดสินใจในภาวะวิกฤต (Crisis Decision)",
      context: "ต้องเลือกระหว่าง 'สิ่งที่ถูกต้องตามกฎ' กับ 'สิ่งที่ช่วยชีวิตคนได้มากที่สุด'",
      options: [
        { text: "ยึดตามหลักการและระบบ เพราะอารมณ์คือความเสี่ยง", value: { te: 2, si: 2, e1: 2, e6: 1 } },
        { text: "เลือกช่วยคนก่อน กฎมีไว้เพื่อมนุษย์ ไม่ใช่ในทางกลับกัน", value: { fe: 2, fi: 2, e2: 2, e8: 1 } },
        { text: "หาทางออกที่สามที่ได้ทั้งคู่แม้จะยากและซับซ้อน", value: { ni: 2, ne: 2, e5: 1, e7: 1 } },
        { text: "ลังเลจนกว่าจะรวบรวมข้อมูลได้ครบทุกด้าน", value: { ti: 2, si: 2, e6: 2, e5: 1 } }
      ]
    },
    {
      title: "ฉากที่ 7: ความฝันที่ถูกวิจารณ์ (Criticized Dream)",
      context: "มีคนบอกว่า 'ไอเดียของคุณมันเพ้อเจ้อและเป็นไปไม่ได้'",
      options: [
        { text: "โกรธและอยากพิสูจน์ให้เห็นว่าเขาคิดผิด", value: { se: 1, te: 2, e8: 2, e3: 2 } },
        { text: "เสียใจลึกๆ และเริ่มสงสัยในคุณค่าของตัวเอง", value: { fi: 2, fe: 1, e4: 2, e2: 1 } },
        { text: "ไม่สนใจ เพราะเขายังไม่เข้าใจข้อมูลเชิงลึกแบบที่คุณรู้", value: { ni: 2, ti: 2, e5: 2, e1: 1 } },
        { text: "หัวเราะและบอกว่า 'ก็นั่นแหละความสนุกของมัน'", value: { ne: 2, se: 2, e7: 2, e9: 1 } }
      ]
    },
    {
      title: "ฉากที่ 8: กระบวนการเรียนรู้ (The Learning Loop)",
      context: "เมื่อคุณสนใจเรื่องใหม่สักเรื่อง คุณมักจะเริ่มจาก...",
      options: [
        { text: "หาหนังสือหรือแหล่งข้อมูลที่ลึกที่สุดมาอ่านรวดเดียว", value: { ti: 2, ni: 2, e5: 2, e4: 1 } },
        { text: "ลงมือทำทันที ลองผิดลองถูกด้วยตัวเอง", value: { se: 2, te: 1, e8: 1, e7: 2 } },
        { text: "หาคอร์สเรียนที่มีระเบียบแบบแผนชัดเจน", value: { si: 2, te: 2, e1: 2, e3: 1 } },
        { text: "ถามจากผู้เชี่ยวชาญหรือเข้ากลุ่มแลกเปลี่ยนความคิดเห็น", value: { fe: 2, ne: 2, e6: 2, e2: 1 } }
      ]
    },
    {
      title: "ฉากที่ 9: ภายใต้ความกดดัน (Under Pressure)",
      context: "เดดไลน์เหลืออีกเพียง 1 ชั่วโมง และงานยังไม่เสร็จ",
      options: [
        { text: "กลายเป็นหุ่นยนต์ ตัดอารมณ์ทิ้ง และเร่งเครื่องเต็มสูบ", value: { te: 2, se: 1, e3: 2, e8: 2 } },
        { text: "สติหลุด กังวลถึงความล้มเหลวที่กำลังจะมาถึง", value: { fi: 1, ne: 2, e6: 2, e4: 1 } },
        { text: "จัดลำดับความสำคัญใหม่และทำเท่าที่แก่นของมันต้องการ", value: { ni: 2, ti: 2, e5: 2, e9: 2 } },
        { text: "หาคนมาช่วยแบ่งเบาหรือขอผ่อนปรน", value: { fe: 2, si: 1, e2: 2, e7: 1 } }
      ]
    },
    {
      title: "ฉากที่ 10: มรดกสุดท้าย (The Legacy)",
      context: "ในวันที่คุณจากโลกนี้ไป คุณอยากให้คนจดจำคุณในฐานะอะไร",
      options: [
        { text: "คนที่สร้างความเปลี่ยนแปลงที่ยิ่งใหญ่และชัดเจน", value: { te: 2, se: 1, e8: 2, e3: 2 } },
        { text: "คนที่ให้ความรักและช่วยเหลือผู้อื่นเสมอ", value: { fe: 2, si: 2, e2: 2, e9: 2 } },
        { text: "คนที่ค้นพบความจริงหรือความรู้ที่เป็นประโยชน์", value: { ti: 2, ni: 2, e5: 2, e1: 2 } },
        { text: "คนที่มีเอกลักษณ์และซื่อสัตย์ต่อจิตวิญญาณตัวเอง", value: { fi: 2, ne: 1, e4: 2, e7: 1 } }
      ]
    },
    // --- SET 2: STRESS & DEEPER VALUES (11-20) ---
    {
      title: "ฉากที่ 11: ความลับที่หนักอึ้ง (The Burden)",
      context: "คุณบังเอิญรู้ความลับขององค์กรที่อาจส่งผลกระทบต่อคนจำนวนมาก แต่ไม่มีใครรู้ว่าคุณรู้",
      options: [
        { text: "คำนวณความเสี่ยงและผลลัพธ์ก่อนจะเลือกเปิดเผยอย่างเป็นระบบ", value: { ni: 2, te: 2, e5: 1, e1: 2 } },
        { text: "แบกมันไว้คนเดียวเพราะไม่อยากให้ใครเดือดร้อนหรือวุ่นวาย", value: { fi: 2, si: 2, e9: 2, e6: 1 } },
        { text: "หาพันธมิตรที่เชื่อใจได้เพื่อปรึกษาและหาทางรับมือ", value: { fe: 2, ne: 1, e6: 2, e2: 1 } },
        { text: "จัดการมันด้วยตัวเองทันที ไม่ว่าผลจะออกมาเป็นอย่างไร", value: { se: 2, ti: 1, e8: 2, e3: 1 } }
      ]
    },
    {
      title: "ฉากที่ 12: เขตปลอดภัยที่สั่นคลอน (The Shaking Foundation)",
      context: "สิ่งที่เคยเชื่อถือมาตลอดชีวิตกลับพิสูจน์ได้ว่ามันเป็นเรื่องหลอกลวง",
      options: [
        { text: "พังทลายชั่วขณะและพยายามค้นหาความจริงที่แท้จริงกว่าเดิม", value: { ti: 2, ni: 2, e4: 2, e5: 2 } },
        { text: "ปฏิเสธความจริงนั้นในช่วงแรกและยึดมั่นในสิ่งที่คุ้นเคยต่อไป", value: { si: 2, fi: 1, e6: 2, e1: 1 } },
        { text: "หัวเราะเยาะโชคชะตาและมองหาความเชื่อใหม่ที่น่าสนใจกว่า", value: { ne: 2, se: 2, e7: 2, e3: 1 } },
        { text: "พยายามรวบรวมผู้คนและสร้างระบบความเชื่อใหม่ที่ถูกต้องขึ้นมา", value: { te: 2, fe: 2, e8: 1, e1: 2 } }
      ]
    },
    {
      title: "ฉากที่ 13: บททดสอบความเสียสละ (The Sacrifice)",
      context: "คุณต้องยอมทำเรื่องที่ผิดจรรยาบรรณเล็กน้อยเพื่อความสำเร็จที่ยิ่งใหญ่ของทีม",
      options: [
        { text: "ทำไม่ได้เด็ดขาด หลักการสำคัญกว่าผลลัพธ์", value: { fi: 2, si: 2, e1: 2, e4: 1 } },
        { text: "ทำเพื่อให้งานเดินหน้าต่อไปได้ ผลลัพธ์คือตัววัดความถูกต้อง", value: { te: 2, se: 2, e3: 2, e8: 1 } },
        { text: "ทำเพราะคนส่วนใหญ่ขอมา ไม่อยากเป็นตัวปัญหาในกลุ่ม", value: { fe: 2, si: 1, e2: 2, e9: 2 } },
        { text: "วิเคราะห์ก่อนว่าจะมีใครรู้ไหมและผลกระทบระยะยาวเป็นอย่างไร", value: { ti: 2, ni: 2, e5: 2, e6: 1 } }
      ]
    },
    {
      title: "ฉากที่ 14: โลกทัศน์ที่ไร้พรมแดน (The Infinite Void)",
      context: "เมื่อมองขึ้นไปบนดวงดาวในคืนที่มืดมิด ความรู้สึกของคุณคือ...",
      options: [
        { text: "สงสัยในกลไกของจักรวาลและจุดเริ่มต้นของมัน", value: { ti: 2, ni: 2, e5: 2, e4: 1 } },
        { text: "รู้สึกถึงความเชื่อมโยงและความหมายที่ลึกซึ้งของชีวิต", value: { fi: 2, ni: 1, e4: 2, e9: 1 } },
        { text: "อยากออกไปสำรวจและสัมผัสความยิ่งใหญ่นั้นด้วยตัวเอง", value: { se: 2, ne: 2, e7: 2, e8: 1 } },
        { text: "รู้สึกตัวเล็กจ้อยและกังวลถึงความไม่แน่นอนของอนาคต", value: { si: 2, te: 1, e6: 2, e1: 1 } }
      ]
    },
    {
      title: "ฉากที่ 15: การปะทะของอุดมการณ์ (Ideological Clash)",
      context: "เพื่อนสนิทที่สุดของคุณมีความเห็นทางการเมืองหรือสังคมที่ตรงข้ามกับคุณสุดขั้ว",
      options: [
        { text: "ถกเถียงด้วยข้อมูลจนกว่าใครคนหนึ่งจะยอมรับเหตุผล", value: { ti: 2, te: 1, e1: 2, e5: 1 } },
        { text: "พยายามทำความเข้าใจมุมมองของเขาและหาจุดร่วมที่เชื่อมโยงกันได้", value: { fe: 2, ni: 1, e2: 1, e9: 2 } },
        { text: "หลีกเลี่ยงการคุยเรื่องนี้เพื่อรักษาความสัมพันธ์", value: { si: 2, fi: 1, e6: 2, e9: 2 } },
        { text: "ไม่สนใจ เพราะความสัมพันธ์คือความรู้สึกไม่ใช่ความคิด", value: { fi: 2, se: 2, e4: 2, e7: 1 } }
      ]
    },
    {
      title: "ฉากที่ 16: การตัดสินสุดท้าย (The Final Verdict)",
      context: "คุณถูกกล่าวหาในเรื่องที่คุณไม่ได้ทำ และไม่มีใครเชื่อคุณ",
      options: [
        { text: "นิ่งเฉยและให้เวลาพิสูจน์ความจริงด้วยตัวมันเอง", value: { ni: 2, ti: 1, e5: 2, e9: 2 } },
        { text: "ต่อสู้ฟาดฟันเพื่อกู้เกียรติยศคืนมาอย่างรุนแรง", value: { se: 2, te: 2, e8: 2, e3: 2 } },
        { text: "หาหลักฐานมายืนยันอย่างเป็นระเบียบและรอบคอบที่สุด", value: { si: 2, ti: 2, e1: 2, e6: 2 } },
        { text: "เสียใจและผิดหวังในมนุษยชาติจนแทบจะทนไม่ได้", value: { fi: 2, fe: 2, e4: 2, e2: 1 } }
      ]
    },
    {
      title: "ฉากที่ 17: พลังอำนาจที่ได้มา (The Acquisition of Power)",
      context: "คุณได้รับตำแหน่งที่สามารถสั่งการใครก็ได้ในองค์กร",
      options: [
        { text: "สร้างระบบที่มีประสิทธิภาพและยุติธรรมที่สุด", value: { te: 2, si: 2, e1: 2, e3: 1 } },
        { text: "เป็นแรงบันดาลใจและคอยดูแลความเป็นอยู่ของทีม", value: { fe: 2, ni: 1, e2: 2, e9: 1 } },
        { text: "ใช้โอกาสนี้ทำตามวิสัยทัศน์ที่คนอื่นมองไม่เห็น", value: { ni: 2, ne: 1, e5: 1, e8: 1 } },
        { text: "ทำให้ทุกคนสนุกและอยากมาทำงานด้วยกันทุกวัน", value: { ne: 2, se: 2, e7: 2, e3: 1 } }
      ]
    },
    {
      title: "ฉากที่ 18: กระจกเงาแห่งความกลัว (The Mirror of Fear)",
      context: "ความล้มเหลวที่น่ากลัวที่สุดสำหรับคุณคือ...",
      options: [
        { text: "การเป็นคนไร้ความสามารถหรือไม่มีข้อมูลเพียงพอ", value: { ti: 2, ni: 1, e5: 2, e1: 1 } },
        { text: "การถูกทอดทิ้งหรือไม่มีใครต้องการ", value: { fe: 2, fi: 1, e2: 2, e6: 2 } },
        { text: "การเป็นคนธรรมดาที่ไม่มีอะไรโดดเด่นหรือมีความหมาย", value: { fi: 2, ni: 2, e4: 2, e3: 1 } },
        { text: "การสูญเสียการควบคุมหรือถูกกดขี่", value: { te: 2, se: 2, e8: 2, e7: 1 } }
      ]
    },
    {
      title: "ฉากที่ 19: บทสนทนากับความตาย (The Encounter with Mortality)",
      context: "ถ้าคุณรู้ว่าจะตายในอีก 24 ชั่วโมง สิ่งที่คุณจะทำคือ...",
      options: [
        { text: "อยู่กับคนที่รักและบอกลาให้ดีที่สุด", value: { fe: 2, fi: 2, e2: 2, e9: 2 } },
        { text: "เขียนบันทึกความรู้หรือสิ่งที่ได้เรียนรู้ทิ้งไว้ให้โลก", value: { ti: 2, ni: 2, e5: 2, e1: 1 } },
        { text: "ทำกิจกรรมที่บ้าบิ่นและตื่นเต้นที่สุดที่ยังไม่ได้ทำ", value: { se: 2, ne: 2, e7: 2, e8: 1 } },
        { text: "นั่งสมาธิและเตรียมตัวจากไปอย่างสงบที่สุด", value: { ni: 2, si: 2, e9: 2, e4: 1 } }
      ]
    },
    {
      title: "ฉากที่ 20: จุดเริ่มต้นของยุคใหม่ (The New Dawn)",
      context: "โลกกำลังล่มสลายและคุณคือผู้นำในการสร้างอารยธรรมใหม่",
      options: [
        { text: "เน้นกฎระเบียบและความปลอดภัยเพื่อความอยู่รอด", value: { si: 2, te: 2, e6: 2, e1: 2 } },
        { text: "เน้นอิสรภาพและความคิดสร้างสรรค์ที่ไม่มีขีดจำกัด", value: { ne: 2, fi: 1, e7: 2, e4: 1 } },
        { text: "เน้นความเสมอภาคและความเห็นอกเห็นใจกัน", value: { fe: 2, fi: 2, e2: 2, e9: 2 } },
        { text: "เน้นการพัฒนาทางปัญญาและเทคโนโลยีเพื่ออนาคต", value: { ti: 2, ni: 2, e5: 2, e8: 1 } }
      ]
    }
  ];

  const handleAnswer = (value) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);
    if (currentQuestion < scenarios.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers) => {
    const scores = {
      ni: 0, ne: 0, ti: 0, te: 0, fi: 0, fe: 0, si: 0, se: 0,
      e1: 0, e2: 0, e3: 0, e4: 0, e5: 0, e6: 0, e7: 0, e8: 0, e9: 0
    };

    finalAnswers.forEach(ans => {
      Object.keys(ans).forEach(key => {
        scores[key] += ans[key];
      });
    });

    const functions = [
      { id: 'Ni', score: scores.ni }, { id: 'Ne', score: scores.ne },
      { id: 'Ti', score: scores.ti }, { id: 'Te', score: scores.te },
      { id: 'Fi', score: scores.fi }, { id: 'Fe', score: scores.fe },
      { id: 'Si', score: scores.si }, { id: 'Se', score: scores.se }
    ].sort((a, b) => b.score - a.score);

    const enneagrams = [
      { id: '1', name: 'The Reformer', score: scores.e1 },
      { id: '2', name: 'The Helper', score: scores.e2 },
      { id: '3', name: 'The Achiever', score: scores.e3 },
      { id: '4', name: 'The Individualist', score: scores.e4 },
      { id: '5', name: 'The Investigator', score: scores.e5 },
      { id: '6', name: 'The Loyalist', score: scores.e6 },
      { id: '7', name: 'The Enthusiast', score: scores.e7 },
      { id: '8', name: 'The Challenger', score: scores.e8 },
      { id: '9', name: 'The Peacemaker', score: scores.e9 }
    ].sort((a, b) => b.score - a.score);

    setResult({ functions, enneagrams });
    setCurrentStep('result');
  };

  const getMBTIRecommendation = (topFuncs) => {
    const f1 = topFuncs[0].id;
    const f2 = topFuncs[1].id;
    
    if (f1 === 'Ni' && (f2 === 'Fe' || f2 === 'Ti')) return 'INFJ / INTJ';
    if (f1 === 'Ne' && (f2 === 'Fi' || f2 === 'Ti')) return 'ENFP / ENTP';
    if (f1 === 'Ti' && (f2 === 'Ne' || f2 === 'Se')) return 'INTP / ISTP';
    if (f1 === 'Te' && (f2 === 'Ni' || f2 === 'Si')) return 'ENTJ / ESTJ';
    if (f1 === 'Fi' && (f2 === 'Ne' || f2 === 'Se')) return 'INFP / ISFP';
    if (f1 === 'Fe' && (f2 === 'Ni' || f2 === 'Si')) return 'ENFJ / ESFJ';
    if (f1 === 'Si' && (f2 === 'Fe' || f2 === 'Te')) return 'ISFJ / ISTJ';
    if (f1 === 'Se' && (f2 === 'Fi' || f2 === 'Ti')) return 'ESFP / ESTP';
    return 'Complex High-Function Profile';
  };

  const reset = () => {
    setAnswers([]);
    setCurrentQuestion(0);
    setResult(null);
    setCurrentStep('intro');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Activity className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">WOR DEEP ANALYTICS</h1>
              <p className="text-xs text-indigo-500 font-mono uppercase tracking-[0.2em]">High-Fidelity Core Probe</p>
            </div>
          </div>
          {currentStep === 'quiz' && (
            <div className="text-sm font-mono text-neutral-400 bg-neutral-900 px-3 py-1 rounded-full border border-neutral-800">
              SCENARIO: <span className="text-indigo-400">{currentQuestion + 1}</span> / {scenarios.length}
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500">
          {currentStep === 'intro' && (
            <div className="p-8 md:p-12 text-center">
              <div className="relative inline-block mb-8">
                <Brain className="text-indigo-500 opacity-30 animate-pulse" size={80} />
                <Target className="absolute inset-0 m-auto text-indigo-500" size={32} />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">การสกัดแก่นแท้ระดับสูง</h2>
              <p className="text-neutral-400 mb-8 leading-relaxed max-w-lg mx-auto">
                เราได้เพิ่มความละเอียดของโจทย์เป็น 20 ฉาก เพื่อสร้างสภาวะความเครียดและทดสอบแรงขับเคลื่อนในระดับจิตใต้สำนึก ผลลัพธ์ที่ได้จะมีความแม่นยำทางสถิติสูงสุด
              </p>
              <button 
                onClick={() => setCurrentStep('quiz')}
                className="group flex items-center gap-2 mx-auto bg-indigo-600 text-white px-10 py-4 rounded-full font-bold hover:bg-indigo-500 shadow-xl shadow-indigo-500/30 transition-all duration-300"
              >
                เข้าสู่ระนาบการวิเคราะห์ <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {currentStep === 'quiz' && (
            <div className="p-6 md:p-10">
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                   <div className="h-1 w-12 bg-indigo-500 rounded-full"></div>
                   <span className="text-indigo-400 text-xs font-bold tracking-widest uppercase">Probe Active</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 leading-tight">{scenarios[currentQuestion].title}</h3>
                <div className="bg-neutral-950/50 p-6 rounded-2xl border-l-4 border-indigo-500 italic text-neutral-300 shadow-inner">
                  "{scenarios[currentQuestion].context}"
                </div>
              </div>

              <div className="grid gap-3">
                {scenarios[currentQuestion].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(opt.value)}
                    className="w-full text-left p-5 rounded-xl border border-neutral-800 bg-neutral-950 hover:border-indigo-500/50 hover:bg-neutral-800 transition-all group flex items-start gap-4 active:scale-[0.98]"
                  >
                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex-shrink-0 flex items-center justify-center text-xs font-mono group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      {idx + 1}
                    </div>
                    <span className="text-neutral-300 group-hover:text-white transition-colors">{opt.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 'result' && (
            <div className="p-8 md:p-12">
              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                  <Target className="text-emerald-500" size={40} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Extraction Complete</h2>
                <p className="text-neutral-500 font-mono text-sm uppercase tracking-widest">Confidence Interval: 94.2%</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-10">
                {/* MBTI Side */}
                <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 shadow-xl">
                  <h4 className="text-sm font-bold text-indigo-400 mb-6 flex items-center gap-2">
                    <Brain size={18} /> COGNITIVE SATURATION
                  </h4>
                  <div className="space-y-4 mb-6">
                    {result.functions.slice(0, 4).map((f) => (
                      <div key={f.id} className="relative pt-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold uppercase text-neutral-400">{f.id} Function</span>
                          <span className="text-xs font-mono text-indigo-500">{Math.round((f.score/40)*100)}%</span>
                        </div>
                        <div className="overflow-hidden h-2 mb-1 text-xs flex rounded-full bg-neutral-900 border border-neutral-800">
                          <div style={{ width: `${Math.min(100, (f.score/40)*100)}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 rounded-full"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-neutral-800">
                    <p className="text-xs text-neutral-500 mb-1">Extracted Archetype:</p>
                    <p className="text-2xl font-bold text-white tracking-tight">{getMBTIRecommendation(result.functions)}</p>
                  </div>
                </div>

                {/* Enneagram Side */}
                <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 shadow-xl">
                  <h4 className="text-sm font-bold text-emerald-400 mb-6 flex items-center gap-2">
                    <Zap size={18} /> ENNEAGRAM CORE
                  </h4>
                  <div className="space-y-4 mb-6">
                    {result.enneagrams.slice(0, 3).map((e) => (
                      <div key={e.id} className="relative pt-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold uppercase text-neutral-400">Type {e.id}: {e.name}</span>
                          <span className="text-xs font-mono text-emerald-500">{Math.round((e.score/40)*100)}%</span>
                        </div>
                        <div className="overflow-hidden h-2 mb-1 text-xs flex rounded-full bg-neutral-900 border border-neutral-800">
                          <div style={{ width: `${Math.min(100, (e.score/40)*100)}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500 rounded-full"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-neutral-800">
                    <p className="text-xs text-neutral-500 mb-1">Primary Drive:</p>
                    <p className="text-2xl font-bold text-white tracking-tight">Type {result.enneagrams[0].id} {result.enneagrams[1].score > result.enneagrams[0].score - 3 ? `w${result.enneagrams[1].id}` : ''}</p>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-950/20 border border-indigo-500/30 p-8 rounded-3xl mb-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Shield size={100} />
                </div>
                <h5 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Shield size={18} className="text-indigo-400" /> WOR'S SYNTHESIS
                </h5>
                <p className="text-base text-neutral-300 leading-relaxed italic">
                  "จากการวิเคราะห์เชิงปริมาณพบว่า ฟังก์ชัน {result.functions[0].id} ของคุณทำงานร่วมกับแรงขับ Type {result.enneagrams[0].id} อย่างแนบแน่น สิ่งนี้แสดงถึงโครงสร้างจิตใจที่มีความมั่นคงสูง (High Stability) คุณมักจะใช้ข้อมูลเพื่อ {result.enneagrams[0].id === '5' ? 'สร้างโลกส่วนตัวที่ปลอดภัย' : result.enneagrams[0].id === '1' ? 'ปรับปรุงระเบียบให้ถูกต้อง' : 'ขับเคลื่อนความสำเร็จ'} ในขณะที่ {result.functions[1].id} ทำหน้าที่เป็นผู้ตรวจทานผลลัพธ์ให้เป็นไปตามอุดมคติ"
                </p>
              </div>

              <button 
                onClick={reset}
                className="w-full flex items-center justify-center gap-2 bg-neutral-800 text-white py-5 rounded-2xl font-bold hover:bg-neutral-700 transition-all border border-neutral-700 shadow-lg active:scale-[0.99]"
              >
                <RefreshCw size={18} /> Re-analyze from Initial State
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-neutral-700 text-[9px] uppercase tracking-[0.4em] font-mono">
            LOGIC CORE v2.5.0-DEEP | ENCRYPTED IDENTITY EXTRACTION | 2026-03-17
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
