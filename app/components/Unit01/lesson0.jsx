"use client";
import useTextToSpeech from "../../hooks/useTextToSpeech";
import { useRouter } from "next/navigation";
import { apiPost, apiGet, getUserId } from "../../../lib/api";
import { API_ENDPOINTS } from "../../../lib/config";

export default function Lesson0() {
  const { speak } = useTextToSpeech();
  const router = useRouter();

  const handleContinue = async () => {
    try {
      const userId = getUserId();
      if (userId) {
        // First fetch the correct Lesson ID (Unit 1, Lesson 0)
        try {
          const lessonRes = await apiGet(API_ENDPOINTS.LESSONS.BY_UNIT_AND_NUMBER(1, 0));
          if (lessonRes.success && lessonRes.data && lessonRes.data.lesson) {
            const lessonId = lessonRes.data.lesson.id;
            await apiPost(API_ENDPOINTS.PROGRESS.UPDATE, {
              userId,
              lessonId: lessonId,
              progressPercentage: 100,
              completed: true,
              score: 100,
              timeSpent: 5
            });
          } else {
            console.error("Could not find Lesson 0 details via API");
          }
        } catch (innerError) {
          console.error("Error fetching Lesson 0 ID:", innerError);
        }
      }
    } catch (error) {
      console.error("Failed to update progress for Lesson 0:", error);
    }
    router.push("/modules/unit01/lesson1");
  };

  const handlePlay = async (chineseText) => {
    if (!chineseText) return;
    const utterance = new SpeechSynthesisUtterance(chineseText);
    utterance.lang = "zh-CN";
    utterance.rate = 0.9;

    const voices = window.speechSynthesis.getVoices();
    const chineseVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().includes("zh-cn") ||
        v.name.toLowerCase().includes("chinese") ||
        v.name.toLowerCase().includes("xiaoxiao") ||
        v.name.toLowerCase().includes("huihui")
    );
    if (chineseVoice) utterance.voice = chineseVoice;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const SectionCard = ({ title, children }) => (
    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 mb-6 hover:shadow-md transition">
      <h2 className="text-xl font-semibold text-blue-900 mb-3">{title}</h2>
      <div className="text-slate-700 leading-relaxed">{children}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-3xl w-full mx-auto">

        {/* --- Pinyin Section --- */}
        <SectionCard title="What is Pinyin?">
          <p className="mb-3">
            <strong>Pinyin (拼音, Hànyǔ Pīnyīn)</strong> uses English letters to
            show Chinese pronunciation. It helps you read, pronounce, and type
            Chinese words without knowing characters yet.
          </p>
          <div className="flex items-center justify-between bg-blue-50 rounded-lg p-3 mb-3">
            <p className="text-lg font-medium text-slate-800">
              你好 → nǐ hǎo → “hello”
            </p>
            <button
              onClick={() => handlePlay("你好")}
              className="px-3 py-1.5 bg-blue-900 text-white rounded-2xl text-sm hover:bg-blue-800"
            >
              🔊 Play
            </button>
          </div>
          <p className="text-slate-600 italic">
            Think of Pinyin as the “spelling system” for Chinese sounds.
          </p>
        </SectionCard>

        {/* --- Syllable Section --- */}
        <SectionCard title="What is a Syllable?">
          <p>
            A <strong>syllable</strong> is one unit of sound.
            In Mandarin, each syllable is built from three parts:
          </p>
          <ul className="list-disc ml-6 my-3 space-y-1">
            <li>
              <strong>Initial</strong> – the starting sound (e.g. b, m, t)
            </li>
            <li>
              <strong>Final</strong> – the ending sound (e.g. a, ao, ang)
            </li>
            <li>
              <strong>Tone</strong> – the voice pitch pattern that changes meaning
            </li>
          </ul>
          <div className="bg-emerald-50 rounded-lg p-3 text-emerald-700 font-medium">
            Example: “ma” + different tones → different meanings!
          </div>
        </SectionCard>

        {/* --- Tones Section --- */}
        <SectionCard title="What are Tones?">
          <p>
            Mandarin is a <strong>tonal language</strong> — changing your voice
            tone changes the meaning of a word.
          </p>

          <div className="overflow-x-auto mt-4">
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead>
                <tr className="bg-slate-100">
                  <th className="p-2 border">Tone</th>
                  <th className="p-2 border">Symbol</th>
                  <th className="p-2 border">Example</th>
                  <th className="p-2 border">Meaning</th>
                  <th className="p-2 border">Audio</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    tone: "1st Tone",
                    symbol: "¯",
                    chinese: "妈",
                    example: "mā",
                    meaning: "mother",
                  },
                  {
                    tone: "2nd Tone",
                    symbol: "´",
                    chinese: "麻",
                    example: "má",
                    meaning: "hemp",
                  },
                  {
                    tone: "3rd Tone",
                    symbol: "ˇ",
                    chinese: "马",
                    example: "mǎ",
                    meaning: "horse",
                  },
                  {
                    tone: "4th Tone",
                    symbol: "`",
                    chinese: "骂",
                    example: "mà",
                    meaning: "scold",
                  },
                  {
                    tone: "Neutral",
                    symbol: "",
                    chinese: "吗",
                    example: "ma",
                    meaning: "question particle",
                  },
                ].map((item, idx) => (
                  <tr key={idx} className="text-center">
                    <td className="border p-2">{item.tone}</td>
                    <td className="border text-4xl">{item.symbol}</td>
                    <td className="border font-semibold">
                      {item.chinese} ({item.example})
                    </td>
                    <td className="border">{item.meaning}</td>
                    <td className="border">
                      <button
                        onClick={() => handlePlay(item.chinese)}
                        className="px-2 py-1 bg-blue-900 text-white rounded text-xs hover:bg-blue-800"
                      >
                        🔊
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* --- Recap Section --- */}
        <SectionCard title="Quick Recap">
          <ul className="space-y-1">
            <li>📖 Pinyin = Chinese sounds written with English letters</li>
            <li>🔤 Syllable = Initial + Final + Tone</li>
            <li>🎵 Tones = change the meaning of a word</li>
          </ul>
          <p className="mt-3 text-emerald-700 font-medium">
            Listen 👂 Repeat 🗣️ and Have Fun 💫
          </p>
        </SectionCard>

        {/* --- Continue Learning Button --- */}
        <div className="text-center mt-10">
          <button
            onClick={handleContinue}
            className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-2xl shadow-md hover:scale-105 transition-all"
          >
            Continue Learning
          </button>
        </div>
      </div>
    </div>
  );
}