export const basicVocabulary = [
  { id: "1", chinese: "你好", pinyin: "nǐ hǎo", english: "hello" },
  { id: "2", chinese: "谢谢", pinyin: "xiè xiè", english: "thank you" },
  { id: "3", chinese: "再见", pinyin: "zài jiàn", english: "goodbye" },
  { id: "4", chinese: "水", pinyin: "shuǐ", english: "water" },
  { id: "5", chinese: "茶", pinyin: "chá", english: "tea" },
  { id: "6", chinese: "米饭", pinyin: "mǐ fàn", english: "rice" },
  { id: "7", chinese: "朋友", pinyin: "péng yǒu", english: "friend" },
  { id: "8", chinese: "学生", pinyin: "xué shēng", english: "student" },
  { id: "9", chinese: "老师", pinyin: "lǎo shī", english: "teacher" },
  { id: "10", chinese: "家", pinyin: "jiā", english: "home/family" },
]

export const exercises = [
  {
    id: "vocab-1",
    type: "vocabulary",
    title: "Basic Greetings & Common Words",
    items: basicVocabulary.slice(0, 10),
    completed: false,
  },
  {
    id: "matching-1",
    type: "matching",
    title: "Match Chinese to English",
    items: basicVocabulary.slice(11 , 20),
    completed: false,
  },
  {
    id: "multiple-choice-1",
    type: "multiple-choice",
    title: "Choose the Correct Translation",
    items: basicVocabulary.slice(21, 30),
    completed: false,
  },
]
