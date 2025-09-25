import subprocess
import re
import pandas as pd

# ✅ Embedded dictionary of questions for each skin condition
condition_questions = {
    "Acne": [
        "Have you experienced acne for more than 3 months? (yes/no): ",
        "Does it worsen during menstruation or stress? (yes/no): ",
        "Is your skin sensitive to skincare products? (yes/no): ",
        "Do you prefer fragrance-free products? (yes/no): ",
        "Do you prefer to avoid products that contain alcohol? (yes/no): "
    ],
    "Inflammation": [
        "Do you experience frequent redness or irritation? (yes/no): ",
        "Have you used anti-inflammatory products before? (yes/no): ",
        "Is your skin sensitive to weather changes? (yes/no): ",
        "Do you want soothing or calming ingredients? (yes/no): ",
        "Do you prefer products without alcohol or fragrance? (yes/no): "
    ],
    "Oily Skin": [
        "Does your face feel greasy shortly after washing? (yes/no): ",
        "Are you prone to frequent breakouts or clogged pores? (yes/no): ",
        "Do you prefer lightweight or gel-based products? (yes/no): ",
        "Do you want oil-control or mattifying ingredients? (yes/no): ",
        "Have thick or creamy products caused breakouts? (yes/no): "
    ],
    "Hyperpigmentation": [
        "Do you have dark spots or uneven skin tone? (yes/no): ",
        "Are the marks from acne or sun damage? (yes/no): ",
        "Do you want brightening or lightening ingredients? (yes/no): ",
        "Have you used niacinamide or vitamin C before? (yes/no): ",
        "Do you have sensitive skin or dryness? (yes/no): "
    ]
}

# ✅ Map question text to preference tags
preference_map = {
    "fragrance-free": "fragrance-free",
    "avoid products that contain alcohol": "alcohol-free",
    "sensitive to skincare products": "sensitive",
    "want oil-control": "oil-control",
    "mattifying ingredients": "oil-control",
    "want soothing": "soothing",
    "calming ingredients": "soothing",
    "want brightening": "brightening",
    "lightening ingredients": "brightening"
}

# ✅ Run classifier and get prediction
def get_prediction():
    result = subprocess.run(['python', 'classifier.py'], capture_output=True, text=True)
    match = re.search(r'Predicted class:\s*(\w+)', result.stdout, re.IGNORECASE)
    if match:
        return match.group(1).capitalize()
    return None

# ✅ Ask questions for the predicted condition
def ask_user_questions(condition):
    questions = condition_questions.get(condition)
    if not questions:
        print(f"No questions defined for condition: {condition}")
        return {}

    print(f"\n🤖 Let's understand your {condition.lower()} better:")
    responses = {}

    for question in questions:
        while True:
            ans = input(f"→ {question}").strip().lower()
            if ans in ['yes', 'no']:
                responses[question] = ans
                break
            else:
                print("Please answer with 'yes' or 'no'.")
    return responses

# ✅ Main logic
if __name__ == "__main__":
    predicted = get_prediction()

    if predicted:
        print(f"\n🧠 Model predicted: {predicted}")
        user_answers = ask_user_questions(predicted)

        # ✅ Extract user preferences (tags)
        selected_tags = []

        for question, answer in user_answers.items():
            if answer == "yes":
                for key in preference_map:
                    if key in question.lower():
                        selected_tags.append(preference_map[key])
                        break  # only first match needed

        print("\n🔍 Extracted Preference Tags:", selected_tags)

        # ✅ Load CSV
        df = pd.read_csv("detailsofpdt.csv")  # Ensure file exists

        # ✅ Normalize tags
        def extract_tags(cell):
            return [tag.strip().lower() for tag in str(cell).split(";") if tag.strip()]

        df["TagList"] = df["Concerns"].apply(extract_tags)

        # ✅ Match scoring
        df["MatchScore"] = df["TagList"].apply(lambda tags: sum(tag in tags for tag in selected_tags))

        # ✅ Sort: MatchScore > Rating > Name and pick top 3
        matched = df[df["MatchScore"] > 0].sort_values(
            by=["MatchScore", "Rating", "Name"], ascending=[False, False, True]
        ).head(3)

        # ✅ Show recommendations
        print("\n🎯 Recommended Products Based on Your Preferences:")
        if matched.empty:
            print("Sorry, no products matched your preferences.")
        else:
            for i, (_, row) in enumerate(matched.iterrows()):
                print(f"\n{i+1}. {row['Name']} (Rating: {row['Rating']}/5.0)")
                print(f"   🌐 URL: {row['URL']}")
                if i == 0:
                    print("   🌟 Top Recommendation")
    else:
        print("❌ Could not determine the skin condition from model output.")
