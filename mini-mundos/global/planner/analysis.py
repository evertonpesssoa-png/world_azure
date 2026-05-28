import json
import os
import calendar
from datetime import datetime, timedelta
from collections import defaultdict

DATA_FILE = "data/notes.json"


# =========================
# Carregamento
# =========================
def load_notes():
    if not os.path.exists(DATA_FILE):
        return {}

    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


# =========================
# BASE
# =========================
def analyze_notes(notes: dict):
    total_notes = 0
    important_days = 0
    total_chars = 0

    for note in notes.values():
        text = note.get("text", "").strip()
        important = note.get("important", False)

        if text:
            total_notes += 1
            total_chars += len(text)

        if important:
            important_days += 1

    avg_chars = round(total_chars / total_notes, 1) if total_notes > 0 else 0

    return {
        "total_notes": total_notes,
        "important_days": important_days,
        "avg_chars": avg_chars,
        "insight": generate_insight(total_notes, important_days, avg_chars)
    }


def generate_insight(total, important, avg_chars):
    if total == 0:
        return "Ainda não há dados suficientes."

    return (
        f"{total} dias registrados. "
        f"{important} importantes. "
        f"Média {avg_chars} caracteres."
    )


# =========================
# BURNOUT v2
# =========================
def calculate_burnout(total_days, important_days, avg_chars):
    if total_days == 0:
        return 0

    freq = min(total_days / 365, 1)
    importance = important_days / total_days if total_days else 0
    intensity = min(avg_chars / 300, 1)
    volume = min(total_days / 50, 1)

    score = (
        freq * 35 +
        importance * 25 +
        intensity * 20 +
        volume * 20
    )

    return int(min(score, 100))


# =========================
# TENDÊNCIA (Regressão)
# =========================
def trend_slope(values):
    n = len(values)
    if n < 2:
        return 0

    x = list(range(n))
    avg_x = sum(x) / n
    avg_y = sum(values) / n

    num = sum((xi - avg_x) * (yi - avg_y) for xi, yi in zip(x, values))
    den = sum((xi - avg_x) ** 2 for xi in x) or 1

    return num / den


def predict_burnout_30(burnout, monthly_activity):
    if not monthly_activity:
        return burnout

    values = [monthly_activity.get(m, 0) for m in range(1, 13)]

    slope = trend_slope(values)
    predicted = burnout + slope * 5

    return int(max(0, min(100, predicted)))


def detect_collapse(predicted):
    if predicted > 85:
        return "CRÍTICO"
    if predicted > 70:
        return "ALTO"
    if predicted > 50:
        return "MODERADO"
    return "BAIXO"


# =========================
# ANTIFRÁGIL (normalizado)
# =========================
def antifragile_score(burnout, monthly_activity):
    if not monthly_activity:
        return 50

    values = list(monthly_activity.values())
    avg = sum(values) / len(values)

    variance = sum((v - avg) ** 2 for v in values) / len(values)
    normalized_var = min(variance / (avg ** 2 + 1), 1)

    stability = (1 - normalized_var) * 100
    recovery = 100 - burnout

    return int(stability * 0.6 + recovery * 0.4)


# =========================
# PADRÕES AVANÇADOS
# =========================
def detect_danger_months(monthly_activity):
    if not monthly_activity:
        return []

    avg = sum(monthly_activity.values()) / len(monthly_activity)

    return [
        m for m, v in monthly_activity.items()
        if v > avg * 1.5
    ]


def predict_next_peak(monthly_activity):
    if not monthly_activity:
        return None

    months = sorted(monthly_activity.keys())
    last = monthly_activity[months[-1]]
    avg = sum(monthly_activity.values()) / len(monthly_activity)

    if last > avg:
        next_month = months[-1] + 1
        if next_month > 12:
            next_month = 1
        return next_month

    return None


def build_daily_map(year_notes):
    daily = {}

    for date_str, note in year_notes.items():
        score = 0
        if note.get("text", "").strip():
            score = 1
        if note.get("important"):
            score = 2
        daily[date_str] = score

    return daily


# =========================
# STREAK (corrigido)
# =========================
def detect_streaks(year_notes):
    if not year_notes:
        return 0

    dates = sorted(year_notes.keys())
    longest = 0
    current = 0
    prev_date = None

    for d in dates:
        date_obj = datetime.strptime(d, "%Y-%m-%d")

        if prev_date and date_obj - prev_date == timedelta(days=1):
            current += 1
        else:
            current = 1

        longest = max(longest, current)
        prev_date = date_obj

    return longest


def detect_obsession_periods(year_notes, threshold=5):
    longest = detect_streaks(year_notes)
    return longest >= threshold


# =========================
# NOVOS INDICADORES (v6)
# =========================
def detect_silence_risk(monthly_activity):
    if not monthly_activity:
        return False

    months = sorted(monthly_activity.keys())
    last = monthly_activity[months[-1]]
    avg = sum(monthly_activity.values()) / len(monthly_activity)

    return last < avg * 0.3


def volatility_score(monthly_activity):
    values = list(monthly_activity.values())
    if not values:
        return 0

    avg = sum(values) / len(values)
    var = sum(abs(v - avg) for v in values) / len(values)

    return int(min(var * 10, 100))


def mental_zone(burnout, antifragile):
    if burnout > 70 and antifragile < 40:
        return "COLAPSO"
    if burnout > 60:
        return "PRESSÃO"
    if antifragile > 70:
        return "CRESCIMENTO"
    return "ESTÁVEL"


# =========================
# ANÁLISE ANUAL (ENGINE)
# =========================
def analyze_year(year: int):
    all_notes = load_notes()

    year_notes = {
        date: note
        for date, note in all_notes.items()
        if date.startswith(str(year))
    }

    base = analyze_notes(year_notes)

    monthly_activity = defaultdict(int)
    weekday_distribution = defaultdict(int)

    for date_str, note in year_notes.items():
        y, m, d = map(int, date_str.split("-"))
        monthly_activity[m] += 1

        dt = datetime(y, m, d)
        weekday = calendar.day_name[dt.weekday()]
        weekday_distribution[weekday] += 1

    busiest_month = (
        max(monthly_activity, key=monthly_activity.get)
        if monthly_activity else None
    )

    # ===== CORE =====
    burnout = calculate_burnout(
        base["total_notes"],
        base["important_days"],
        base["avg_chars"]
    )

    predicted = predict_burnout_30(burnout, monthly_activity)
    collapse = detect_collapse(predicted)
    antifragile = antifragile_score(burnout, monthly_activity)

    # ===== v6 =====
    zone = mental_zone(burnout, antifragile)
    silence_risk = detect_silence_risk(monthly_activity)
    volatility = volatility_score(monthly_activity)

    alerts = []
    if collapse == "CRÍTICO":
        alerts.append("🚨 Risco de colapso iminente")
    if predicted > burnout + 10:
        alerts.append("📈 Pressão aumentando")
    if antifragile < 40:
        alerts.append("🧩 Baixa recuperação")
    if silence_risk:
        alerts.append("⚠️ Queda brusca de atividade")
    if not alerts:
        alerts.append("✔️ Estável")

    danger_months = detect_danger_months(monthly_activity)
    next_peak = predict_next_peak(monthly_activity)
    daily_map = build_daily_map(year_notes)
    longest_streak = detect_streaks(year_notes)
    obsession_flag = detect_obsession_periods(year_notes)

    return {
        "year": year,
        "total_days_with_notes": base["total_notes"],
        "important_days": base["important_days"],
        "avg_text_size": base["avg_chars"],
        "insight": base["insight"],
        "monthly_activity": dict(monthly_activity),
        "busiest_month": busiest_month,
        "weekday_distribution": dict(weekday_distribution),

        # CORE
        "burnout_score": burnout,
        "predicted_burnout_30": predicted,
        "collapse_risk": collapse,
        "antifragile_score": antifragile,
        "mental_zone": zone,
        "volatility_score": volatility,
        "silence_risk": silence_risk,
        "alerts": alerts,

        # PADRÕES
        "danger_months": danger_months,
        "next_peak_month": next_peak,
        "daily_intensity": daily_map,
        "longest_streak": longest_streak,
        "obsession_detected": obsession_flag
    }
