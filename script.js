
let totalPoints = 0;
let completedActivities = 0;
let gameScore = 0;

const questions = [
    { q: "What is 12 × 8?", a: 96 },
    { q: "What is 15 × 4?", a: 60 },
    { q: "What is 144 ÷ 12?", a: 12 },
    { q: "What is 25 + 75?", a: 100 }
];

let questionIndex = 0;

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const selected = document.getElementById(pageId);

    if (selected) {
        selected.classList.add("active");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
}

function updateDashboard() {
    document.getElementById("points").textContent = totalPoints;
    document.getElementById("completed").textContent =
        completedActivities;

    document.getElementById("gameScore").textContent = gameScore;

    const percentage = Math.min(completedActivities * 10, 100);

    document.getElementById("progress").style.width =
        percentage + "%";

    document.getElementById("progressText").textContent =
        percentage + "% completed";
}

async function completeActivity(points = 10) {
    totalPoints += points;
    completedActivities++;

    updateDashboard();

    try {
        await fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                points: totalPoints,
                completed: completedActivities
            })
        });
    } catch (error) {
        console.log("Progress saved locally for this session.");
    }
}

function checkAnswer() {
    const answer = Number(
        document.getElementById("answer").value
    );

    const result = document.getElementById("gameResult");

    if (!Number.isFinite(answer) ||
        document.getElementById("answer").value.trim() === "") {
        result.textContent = "Enter a valid answer.";
        return;
    }

    if (answer === questions[questionIndex].a) {
        result.textContent = "Correct! +20 points.";
        gameScore += 20;
        totalPoints += 20;
        completedActivities++;
        updateDashboard();
    } else {
        result.textContent = "Not quite! Try the next question.";
    }

    questionIndex = (questionIndex + 1) % questions.length;

    document.getElementById("question").textContent =
        questions[questionIndex].q;

    document.getElementById("answer").value = "";
}

async function calculatePhysics() {
    const velocity = Number(document.getElementById("velocity").value);
    const acceleration = Number(document.getElementById("acceleration").value);
    const time = Number(document.getElementById("time").value);

    if (![velocity, acceleration, time].every(Number.isFinite) ||
        time < 0) {
        document.getElementById("physicsResult").textContent =
            "Please enter valid values. Time cannot be negative.";
        return;
    }

    try {
        const response = await fetch("/api/physics", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ velocity, acceleration, time })
        });

        if (!response.ok) throw new Error("API unavailable");

        const data = await response.json();

        document.getElementById("physicsResult").innerHTML =
            `Final velocity: ${data.final_velocity} m/s<br>
             Displacement: ${data.displacement} m`;

    } catch (error) {
        const finalVelocity = velocity + acceleration * time;
        const displacement =
            velocity * time + 0.5 * acceleration * time ** 2;

        document.getElementById("physicsResult").textContent =
            `Final velocity: ${finalVelocity.toFixed(2)} m/s | ` +
            `Displacement: ${displacement.toFixed(2)} m`;
    }
}

function lesson(name) {
    document.getElementById("lessonResult").textContent =
        "Lesson selected: " + name +
        ". Remember to train safely and respect your limits.";

    completeActivity(5);
}

async function loadProgress() {
    try {
        const response = await fetch("/api/progress");

        if (!response.ok) return;

        const data = await response.json();

        totalPoints = data.points || 0;
        completedActivities = data.completed || 0;

        updateDashboard();
    } catch (error) {
        console.log("Starting a new session.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    updateDashboard();
    loadProgress();
});
