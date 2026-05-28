import json
import os
import calendar
from datetime import datetime
from collections import defaultdict

DATA_FILE = "data/notes.json"


# =========================
# Carregamento de dados
# =========================
def load_notes():
    if not os.path.exists(DATA_FILE):
        return {}

    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


# =========================
# Análise base
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

    insight = generate_insight(
        total_notes,
        important_days,
        avg_chars
    )

    return {
        "total_notes": total_notes,
        "important_days": important_days,
        "avg_chars": avg_chars,
        "insight": insight
    }


def generate_insight(total, important, avg_chars):
    if total == 0:
        return (
            "Ainda não há anotações suficientes para análise. "
            "Comece registrando seus dias para gerar insights."
        )

    messages = []

    if total <= 3:
        messages.append(
            "Você fez poucas anotações até agora, indicando um uso pontual do diário."
        )
    else:
        messages.append(
            f"Você já registrou {total} dias, criando um histórico consistente."
        )

    if important > 0:
        messages.append(
            f"{important} dia(s) foram marcados como importantes."
        )
    else:
        messages.append(
            "Nenhum dia foi marcado como importante até o momento."
        )

    if avg_chars < 80:
        messages.append("As anotações são curtas e objetivas.")
    elif avg_chars < 250:
        messages.append("As anotações indicam reflexões moderadas.")
    else:
        messages.append("As anotações são longas e profundas.")

    return " ".join(messages)


# =========================
# 🔥 Métricas avançadas (v4)
# =========================
def calculate_burnout(total_days, important_days, avg_chars):
    """
    Score simples 0–100 baseado em:
    - frequência de registro
    - dias importantes
    - intensidade de escrita
    """
    if total_days == 0:
        return 0

    freq_factor = min(total_days / 365, 1)
    importance_factor = important_days / total_days if total_days else 0
    intensity_factor = min(avg_chars / 300, 1)

    burnout = (
        freq_factor * 40 +
        importance_factor * 40 +
        intensity_factor * 20
    )

    return round(min(burnout, 100))


def predict_burnout_30(burnout_score, monthly_activity):
    """
    Projeção simples baseada em tendência recente
    """
    if not monthly_activity:
        return burnout_score

    months = sorted(monthly_activity.keys())
    recent = monthly_activity[months[-1]]
    avg = sum(monthly_activity.values()) / len(monthly_activity)

    trend = (recent - avg) / avg if avg > 0 else 0

    prediction = burnout_score + (trend * 30)
    return int(max(0, min(100, prediction)))


def detect_collapse_risk(burnout_score, predicted):
    if predicted > 85:
        return "CRÍTICO"
    elif predicted > 70:
        return "ALTO"
    elif predicted > 50:
        return "MODERADO"
    else:
        return "BAIXO"


def calculate_antifragile(burnout_score, monthly_activity):
    """
    Quanto mais equilibrada a atividade ao longo dos meses,
    maior a antifragilidade.
    """
    if not monthly_activity:
        return 50

    values = list(monthly_activity.values())
    avg = sum(values) / len(values)
    variance = sum((v - avg) ** 2 for v in values) / len(values)

    stability = max(0, 100 - variance)
    recovery_factor = max(0, 100 - burnout_score)

    score = (stability * 0.6) + (recovery_factor * 0.4)
    return int(max(0, min(100, score)))


def generate_alerts(burnout, predicted, collapse_risk, antifragile):
    alerts = []

    if burnout > 70:
        alerts.append("⚠️ Nível de burnout elevado")

    if predicted > burnout + 10:
        alerts.append("📈 Tendência de aumento de pressão nos próximos 30 dias")

    if collapse_risk == "CRÍTICO":
        alerts.append("🚨 Risco de colapso iminente")

    if antifragile < 40:
        alerts.append("🧩 Baixa capacidade de recuperação detectada")

    if not alerts:
        alerts.append("✔️ Sistema mental estável")

    return alerts


# =========================
# 🔥 Análise anual (dashboard)
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

        if note.get("important"):
            weekday = calendar.day_name[
                datetime(y, m, d).weekday()
            ]
            weekday_distribution[weekday] += 1

    busiest_month = (
        max(monthly_activity, key=monthly_activity.get)
        if monthly_activity else None
    )

    # =========================
    # Métricas v4
    # =========================
    burnout_score = calculate_burnout(
        base["total_notes"],
        base["important_days"],
        base["avg_chars"]
    )

    predicted_burnout_30 = predict_burnout_30(
        burnout_score,
        monthly_activity
    )

    collapse_risk = detect_collapse_risk(
        burnout_score,
        predicted_burnout_30
    )

    antifragile_score = calculate_antifragile(
        burnout_score,
        monthly_activity
    )

    alerts = generate_alerts(
        burnout_score,
        predicted_burnout_30,
        collapse_risk,
        antifragile_score
    )

    # =========================
    # Retorno (compatível + novo)
    # =========================
    return {
        "year": year,
        "total_days_with_notes": base["total_notes"],
        "important_days": base["important_days"],
        "avg_text_size": base["avg_chars"],
        "insight": base["insight"],
        "monthly_activity": dict(monthly_activity),
        "busiest_month": busiest_month,
        "weekday_distribution": dict(weekday_distribution),

        # NOVOS (Dashboard v4)
        "burnout_score": burnout_score,
        "predicted_burnout_30": predicted_burnout_30,
        "collapse_risk": collapse_risk,
        "antifragile_score": antifragile_score,
        "alerts": alerts
    }
