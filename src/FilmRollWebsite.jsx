import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
const asset = (p) => `${import.meta.env.BASE_URL}${p}`;

// local UI primitives 
const Button = ({ className = "", ...props }) => (
  <button
    className={
      "inline-flex items-center justify-center rounded-xl px-4 py-2 font-semibold transition " +
      "focus:outline-none focus:ring-2 focus:ring-pink-500/60 focus:ring-offset-2 focus:ring-offset-transparent " +
      className
    }
    {...props}
  />
);

const Card = ({ className = "", ...props }) => (
  <div className={"rounded-2xl border bg-white shadow " + className} {...props} />
);

const CardContent = ({ className = "", ...props }) => (
  <div className={"p-4 " + className} {...props} />
);

export default function FilmRollWebsite() {
  const [page, setPage] = useState("gate");
  const [attempt, setAttempt] = useState(0);
  const [answer, setAnswer] = useState("");

  const [clicks, setClicks] = useState(0);
  const [hearts, setHearts] = useState([]);
  const [initials, setInitials] = useState([]);
  const [confettiBurst, setConfettiBurst] = useState(false);
  const [audioReady, setAudioReady] = useState(false); // kept for status
  const [openFlower, setOpenFlower] = useState(null);  // which bouquet note is open
  const [sparkleFlower, setSparkleFlower] = useState(null); // which flower sparkles

  const bouquetReasons = [
    "You are super patient with me.",
    "You are overflowingly generous with love and kindness.",
    "You remind me I'm not a failure and believe in me.",
    "You love my weird nerdiness and make me comfortable being myself.",
    "Your hugs feel like home big turtle.",
    "You are motivated and hardworking which I admire."
  ];

  // positions must match the bouquet flowers for the sparkle burst
  const flowerPositions = [
    { x: 30, y: 35 },
    { x: 45, y: 30 },
    { x: 60, y: 34 },
    { x: 40, y: 45 },
    { x: 55, y: 46 },
    { x: 70, y: 40 }
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const newHearts = Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        delay: Math.random() * 5,
        duration: 6 + Math.random() * 4
      }));
      setHearts(newHearts);

      // floating initials positions
      const floats = Array.from({ length: 10 }).map((_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        size: 40 + Math.random() * 30,
        speed: 12 + Math.random() * 8,
        delay: Math.random() * 6
      }));
      setInitials(floats);
    }
  }, []);

  const photos = [
    { url: asset("photos/pic1.jpg"), caption: "Our first JB trip ❤️" },
    { url: asset("photos/pic2.jpg"), caption: "Second of many JBs 😂" },
    { url: asset("photos/pic3.jpg"), caption: "Us at One Holland V 🌅" },
    { url: asset("photos/pic4.jpg"), caption: "Surprise mirror selfie 🤪" },
  ];

  const handleGateSubmit = (e) => {
    e.preventDefault();
    tryPlayAudio(); 
    if (attempt === 0) {
      setAttempt(1);
    } else if (attempt === 1) {
      setAttempt(2);
    } else {
      setAttempt(3);
      setTimeout(() => setPage("intro"), 1400);
    }
    setAnswer("");
  };

  // Audio helpers
  const tryPlayAudio = () => {
    const el = document.getElementById("bgm");
    if (!el) return;
    el.muted = false;
    el.play().then(() => setAudioReady(true)).catch(() => setAudioReady(false));
  };

  // ensure music keeps playing after first user interaction
  useEffect(() => {
    const oneTimeUnmute = () => {
      tryPlayAudio();
    };
    window.addEventListener("click", oneTimeUnmute, { once: true });
    window.addEventListener("touchstart", oneTimeUnmute, { once: true });
    return () => {
      window.removeEventListener("click", oneTimeUnmute);
      window.removeEventListener("touchstart", oneTimeUnmute);
    };
  }, []);

  return (
    <div className="min-h-screen font-sans">
      {/* Background music (place your file in /public as /music.mp3) */}
      <audio id="bgm" src={asset("music.mp3")} loop autoPlay muted />

      <AnimatePresence mode="wait">
        {/* Gate Page */}
        {page === "gate" && (
          <motion.div key="gate" className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0b1020] to-[#0a1a3a] text-white px-4">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-md bg-[#111827] border border-pink-500/30 rounded-2xl shadow-2xl p-6 text-center">
              <div className="text-sm text-pink-400 mb-2">🔒 Private page</div>
              <h1 className="text-2xl font-extrabold mb-4">Who is the love of ur life?</h1>
              <form onSubmit={handleGateSubmit} className="flex gap-3 justify-center">
                <input value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="type their name" className="flex-1 rounded-xl px-4 py-2 bg-[#0f1430] border border-white/10 focus:outline-none focus:ring-2 focus:ring-pink-500" />
                <Button type="submit" className="bg-pink-500 hover:bg-pink-600 rounded-xl text-white">Submit</Button>
              </form>
              <div className="h-10 mt-4 flex items-center justify-center">
                {attempt === 1 && (<motion.div animate={{ opacity: 1 }} className="text-pink-300 font-semibold">CARISSA?!? Awww mann...</motion.div>)}
                {attempt === 2 && (<motion.div animate={{ opacity: 1 }} className="text-pink-300 font-semibold">HAZEL?!?! Who dafuq...</motion.div>)}
                {attempt === 3 && (<motion.div animate={{ opacity: 1 }} className="text-pink-300 font-semibold">Took u long enough to type Chloe... hng!</motion.div>)}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Intro Page */}
        {page === "intro" && (
          <motion.div key="intro" className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0b1020] to-[#0a1a3a] text-center text-white px-4 overflow-hidden">
            {/* Floating initials C + A */}
            {initials.map((f) => (
              <motion.div
                key={f.id}
                className="absolute select-none pointer-events-none text-white/15 font-extrabold"
                style={{ left: f.x, fontSize: f.size }}
                initial={{ y: "110vh", opacity: 0 }}
                animate={{ y: "-20vh", opacity: [0, 0.6, 0] }}
                transition={{ duration: f.speed, repeat: Infinity, delay: f.delay }}
              >
                C + A
              </motion.div>
            ))}

            <div className="text-pink-400 mb-2 relative z-10">trolled hehe i know its me :))</div>
            <h1 className="text-5xl font-extrabold drop-shadow-lg relative z-10">Happy Anniversary Alan my love 💕</h1>
            <div className="mt-2 text-white/80 relative z-10">2 Sep 2025</div>
            <div className="mt-8 flex items-center gap-3 relative z-10">
              <Button onClick={() => { setPage("filmroll"); tryPlayAudio(); }} className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-full shadow-lg">Enter Our Memories</Button>
              {/* removed enable-music button; music auto-starts on first interaction */}
            </div>
          </motion.div>
        )}

        {/* Filmroll Page */}
        {page === "filmroll" && (
          <motion.div key="filmroll" className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-200 flex flex-col items-center py-10 px-4">
            <h1 className="text-4xl font-extrabold text-pink-600 mb-10 drop-shadow-md">Our Little Film Roll <Heart className="inline ml-2 text-red-500" /></h1>
            <div className="relative overflow-x-hidden w-full flex justify-center">
              <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} transition={{ duration: 2, ease: "easeInOut" }} className="flex space-x-8 bg-white p-6 rounded-2xl shadow-2xl border-4 border-gray-200">
                {photos.map((photo, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.3 }}>
                    <Card className="bg-white shadow-lg rounded-2xl overflow-hidden w-[250px] border border-pink-200">
                      <img src={photo.url} alt="Memory" className="w-full h-56 object-cover" />
                      <CardContent className="p-3 text-center text-gray-700 italic text-sm">{photo.caption}</CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            <div className="mt-16 text-center">
              <Button onClick={() => setPage("loveMeter")} className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-full shadow-lg">Click to find out how much I love you 💖</Button>
            </div>
          </motion.div>
        )}

        {/* Love Meter Page */}
        {page === "loveMeter" && (
          <motion.div key="loveMeter" className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0b1020] to-[#0a1a3a] overflow-hidden text-white">
            {hearts.map((h) => (
              <motion.div key={h.id} className="absolute text-pink-400" style={{ left: h.x }} initial={{ y: -60, opacity: 0 }} animate={{ y: "110vh", opacity: [0, 1, 0] }} transition={{ duration: h.duration, repeat: Infinity, delay: h.delay }}><Heart /></motion.div>
            ))}
            {clicks < 3 ? (
              <motion.div className="cursor-pointer z-10 flex items-center justify-center" onClick={() => setClicks(clicks + 1)} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6, repeat: Infinity }} style={{ width: 220 + clicks * 220, height: 220 + clicks * 220 }}>
                <Heart className="text-pink-500 w-full h-full" />
              </motion.div>
            ) : (
              <motion.div className="z-20 text-4xl font-bold text-white flex flex-col items-center justify-center text-center">
                <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 2, -2, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="flex items-center gap-2">Even more than this!!! <Sparkles className="text-yellow-300" /></motion.div>
                <div className="mt-6">
                  <Button
                    onClick={() => {
                      // heart confetti burst then go to letter
                      setConfettiBurst(true);
                      setTimeout(() => { setConfettiBurst(false); setPage("letter"); }, 900);
                    }}
                    className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-full shadow-lg"
                  >
                    Open the Letter 💌
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Confetti hearts burst */}
            {confettiBurst && (
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {Array.from({ length: 40 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    initial={{ x: "50%", y: "60%", opacity: 1, rotate: 0 }}
                    animate={{
                      x: `${50 + (Math.random() * 60 - 30)}%`,
                      y: `${20 + Math.random() * 60}%`,
                      opacity: 0,
                      rotate: Math.random() * 360
                    }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                  >
                    <Heart className="text-pink-500 w-6 h-6" />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Letter Page */}
        {page === "letter" && (
          <motion.div
            key="letter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0b1020] to-[#0a1a3a] px-6 text-white"
          >
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[1100px]">
              <div className="rounded-2xl bg-white text-[#0b1020] shadow-2xl border border-[#e5e7eb] relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-20 pointer-events-none rounded-2xl" />
                <div className="px-8 py-5 border-b border-[#eef2f7] flex items-center gap-2 font-semibold text-lg relative z-10">
                  My dearest big turtle Alan,
                </div>
                <div className="px-10 py-10 leading-8 whitespace-pre-line text-[16.5px] relative z-10">
I didn't think i wld be writing agn aft word vomitting on postcards during exchange HAHAH but here I am cos I rly have too much to be grateful for!! Truthfully I've spent a lot of time thinking whtr I'm selfish if I say like I love u because u are my rock; but what I realised is I genuinely love u for who u are, and ur actions flow from how wonderful of a person u are (if it makes sense). I can wholehearted say that I love u for who u are, the way you're so so patient, reliable and comforting, and when those parts of u show thru ur actions, it just reminds me of how emotionally mature you are and I rly find myself falling further into the depths for u. and needless to say, I'm super grateful that u continue to help me thru a shitty period in my life and for repeatedly reminding me that I'm not a failure even when I lament that I am time and time agn. also, it shdn't have taken this long N I'm sorry u had to put up w this but I can finally say I'm rly trying my best to get rid of this last ingrained L habit of mine which is not listening well. eventually w trying hard enough, i hope it'll become second nature like being able to admit my mistakes n not being aggressive to u cos that's rly the least u deserve. The past yr has been nothing short of easy on u honestly but I will continue to reflect and improve on myself as a person and as your gf, and hopefully after this year the hardest is behind us. I look fwd to many many more years w u bb, and I hope fate has the same plans as I do. happy anniversary :)) 

- Your lil turtle forever, chloe
                </div>
                <div className="px-10 pb-6 flex items-center justify-between relative z-10">
                  {/* Easter egg heart (clickable) */}
                  <Button onClick={() => setPage("bouquet")} className="bg-pink-500 hover:bg-pink-600 text-white shadow px-4 py-2 rounded-full">A bouquet for you 💐</Button>
                  <button
                    onClick={() => setPage("easter")}
                    className="text-pink-500 font-bold text-2xl italic hover:scale-110 transition"
                    title="secret surprise"
                  >
                    ♡
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Bouquet Page */}
        {page === "bouquet" && (
          <motion.div key="bouquet" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0b1020] to-[#0a1a3a] text-white px-6 py-10">
            <h2 className="text-3xl font-extrabold mb-6">A bouquet of reasons I love you 💐</h2>
            <div className="text-white/70 mb-6">Tap each flower to reveal a note</div>

            <div className="w-full max-w-[820px]">
              <svg viewBox="0 0 100 120" className="w-full drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                {/* stems */}
                {flowerPositions.map((f, i) => (
                  <path key={i} d={`M50,95 Q50,70 ${f.x},${f.y + 10} T ${f.x},${f.y}`} stroke="#4ade80" strokeWidth="1.2" fill="none" />
                ))}

                {/* flowers */}
                {[
                  { x: 30, y: 35, c: "#ff6b6b" },
                  { x: 45, y: 30, c: "#f97316" },
                  { x: 60, y: 34, c: "#a78bfa" },
                  { x: 40, y: 45, c: "#22c55e" },
                  { x: 55, y: 46, c: "#06b6d4" },
                  { x: 70, y: 40, c: "#f43f5e" }
                ].map((f, i) => (
                  <g key={i} transform={`translate(${f.x} ${f.y})`} className="cursor-pointer">
                    {Array.from({ length: 6 }).map((_, k) => {
                      const ang = (Math.PI * 2 * k) / 6;
                      const px = Math.cos(ang) * 6;
                      const py = Math.sin(ang) * 6;
                      return (
                        <motion.circle
                          key={k}
                          cx={px}
                          cy={py}
                          r="4.2"
                          fill={f.c}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setOpenFlower(i);
                            setSparkleFlower(i);
                            setTimeout(() => setSparkleFlower(null), 800);
                          }}
                        />
                      );
                    })}
                    <motion.circle
                      r="3.6"
                      fill="#ffd166"
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setOpenFlower(i);
                        setSparkleFlower(i);
                        setTimeout(() => setSparkleFlower(null), 800);
                      }}
                    />
                  </g>
                ))}

                {/* sparkle burst when a flower is tapped */}
                {sparkleFlower !== null && (
                  <g
                    key={`sp-${sparkleFlower}`}
                    transform={`translate(${flowerPositions[sparkleFlower].x} ${flowerPositions[sparkleFlower].y})`}
                  >
                    {Array.from({ length: 8 }).map((_, k) => {
                      const ang = (Math.PI * 2 * k) / 8;
                      const radius = 7 + Math.random() * 3;
                      const px = Math.cos(ang) * radius;
                      const py = Math.sin(ang) * radius;
                      const rot = (k * 360) / 8;
                      return (
                        <motion.g
                          key={k}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.35, ease: "easeOut" }}
                          transform={`translate(${px} ${py}) rotate(${rot})`}
                        >
                          <path d="M0 -1.2 L1 0 L0 1.2 L-1 0 Z" fill="#fde047" />
                        </motion.g>
                      );
                    })}
                    <motion.circle
                      r="1.6"
                      fill="#fff"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0] }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </g>
                )}

                {/* bow (middle of stems) */}
                <g transform="translate(50 72)">
                  <circle r="3" fill="#f472b6" />
                  <path d="M0 0 L-12 -7 L-5 0 L-12 7 Z" fill="#fb7185" />
                  <path d="M0 0 L12 -7 L5 0 L12 7 Z" fill="#fb7185" />
                </g>
              </svg>
            </div>

            <div className="mt-8 flex gap-3">
              <Button onClick={() => setPage("letter")} className="bg-white text-[#0b1020] hover:bg-white/90">Back to the letter</Button>
            </div>

            {/* note modal */}
            <AnimatePresence>
              {openFlower !== null && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="max-w-lg w-full bg-white text-[#0b1020] rounded-2xl shadow-2xl border border-[#e5e7eb] overflow-hidden">
                    <div className="px-6 py-4 border-b text-lg font-bold">Reason #{openFlower + 1}</div>
                    <div className="px-6 py-6 leading-7">{bouquetReasons[openFlower]}</div>
                    <div className="px-6 pb-6 flex items-center justify-center">
                      <Button onClick={() => setOpenFlower(null)} className="bg-gray-200 hover:bg-gray-300">Close 🌸</Button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Manchester United themed Easter Egg */}
        {page === "easter" && (
          <motion.div key="easter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen flex flex-col items-center justify-center bg-[#da291c] text-white px-4 py-10">
            <div className="text-5xl font-black tracking-wider drop-shadow-md">GLORY GLORY MAN UNITED</div>
            <div className="mt-2 text-yellow-300 font-semibold">For my favorite Red Devil ❤️🟡</div>
            <div className="mt-8 w-full max-w-[900px] aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-black/40">
              <img src={asset("manutd-surprise.png")} alt="Manchester United surprise"/>
            </div>
            <div className="mt-8 flex gap-3">
              <Button onClick={() => setPage("letter")} className="bg-black hover:bg-black/80 text-white">Back to the letter</Button>
              <Button onClick={() => setPage("filmroll")} className="bg-white text-[#da291c] hover:bg-white/90">Back to memories</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
