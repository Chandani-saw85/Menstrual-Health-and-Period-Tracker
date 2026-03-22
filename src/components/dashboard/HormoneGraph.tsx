import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const HormoneGraph = () => {
  const data = useMemo(() => {
    const points = [];
    for (let day = 1; day <= 28; day++) {
      let estrogen = 0, progesterone = 0, lh = 0;
      // Estrogen: rises in follicular, peaks at ovulation
      if (day <= 5) estrogen = 20 + day * 5;
      else if (day <= 13) estrogen = 45 + (day - 5) * 12;
      else if (day === 14) estrogen = 140;
      else if (day <= 21) estrogen = 80 + (day - 14) * 5;
      else estrogen = Math.max(30, 115 - (day - 21) * 12);

      // Progesterone: low first half, rises after ovulation
      if (day <= 14) progesterone = 5 + day * 1.5;
      else if (day <= 22) progesterone = 26 + (day - 14) * 12;
      else progesterone = Math.max(10, 122 - (day - 22) * 18);

      // LH surge at ovulation
      if (day >= 12 && day <= 16) lh = day === 14 ? 100 : day === 13 || day === 15 ? 50 : 20;
      else lh = 10;

      points.push({ day: `Day ${day}`, estrogen, progesterone, lh });
    }
    return points;
  }, []);

  return (
    <div className="fun-card border-lilac/20">
      <h3 className="font-display text-lg font-bold text-foreground mb-3">📈 Hormone Trends</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="estGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(340,75%,55%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(340,75%,55%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="progGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(270,60%,75%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(270,60%,75%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="lhGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(45,95%,60%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(45,95%,60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} interval={6} />
            <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: "hsla(0,0%,100%,0.95)",
                border: "1px solid hsl(340,20%,88%)",
                borderRadius: "1rem",
                fontSize: "12px",
              }}
            />
            <Area type="monotone" dataKey="estrogen" stroke="hsl(340,75%,55%)" fill="url(#estGrad)" strokeWidth={2} name="Estrogen" />
            <Area type="monotone" dataKey="progesterone" stroke="hsl(270,60%,75%)" fill="url(#progGrad)" strokeWidth={2} name="Progesterone" />
            <Area type="monotone" dataKey="lh" stroke="hsl(45,95%,60%)" fill="url(#lhGrad)" strokeWidth={2} name="LH" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-3 h-1 rounded-full bg-primary" /> Estrogen</span>
        <span className="flex items-center gap-1"><span className="w-3 h-1 rounded-full bg-secondary" /> Progesterone</span>
        <span className="flex items-center gap-1"><span className="w-3 h-1 rounded-full bg-sunflower" /> LH</span>
      </div>
    </div>
  );
};

export default HormoneGraph;
