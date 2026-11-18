
document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // ELEMENT REFERENCES
    // ==========================================

    const leafInput = document.getElementById("leafInput");
    const browseButton = document.getElementById("browseButton");
    const uploadZone = document.getElementById("uploadZone");

    const previewContainer = document.getElementById("previewContainer");
    const leafPreview = document.getElementById("leafPreview");
    const removeImage = document.getElementById("removeImage");

    const fileName = document.getElementById("fileName");
    const analyseButton = document.getElementById("analyseButton");

    const emptyResult = document.getElementById("emptyResult");
    const loadingResult = document.getElementById("loadingResult");
    const actualResult = document.getElementById("actualResult");
    const errorResult = document.getElementById("errorResult");

    const resultCrop = document.getElementById("resultCrop");
    const resultDisease = document.getElementById("resultDisease");

    const confidenceValue = document.getElementById("confidenceValue");
    const confidenceFill = document.getElementById("confidenceFill");

    const errorMessage = document.getElementById("errorMessage");

    // Care guide elements
    const careSymptoms = document.getElementById("careSymptoms");
    const careAbout = document.getElementById("careAbout");
    const careTreatment = document.getElementById("careTreatment");
    const carePrevention = document.getElementById("carePrevention");

    let selectedFile = null;
    let previewURL = null;


    // ==========================================
    // CURRENT DATE
    // ==========================================

    const currentDate = document.getElementById("currentDate");

    if (currentDate) {
        currentDate.textContent = new Date().toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        ).toUpperCase();
    }


    // ==========================================
    // DISEASE CARE INFORMATION
    // ==========================================

    function getCareGuide(crop, disease) {

        const name = disease.toLowerCase().replace(/_/g, " ");

        // Healthy plant
        if (name.includes("healthy")) {
            return {
                symptoms:
                    "No disease symptoms were identified by the model in this image. The plant appears to belong to a healthy category.",

                about:
                    "The AI classified this leaf as healthy. Continue observing the plant because early disease symptoms may not always be visible.",

                treatment:
                    "No disease treatment is indicated by this prediction. Maintain appropriate watering, nutrition and growing conditions.",

                prevention:
                    "Inspect leaves regularly, maintain good airflow, avoid waterlogging and keep gardening tools clean."
            };
        }

        // Bacterial spot
        if (name.includes("bacterial spot")) {
            return {
                symptoms:
                    "Small dark, water-soaked spots may appear on leaves. These can enlarge, turn brown and sometimes develop yellow areas around them.",

                about:
                    "Bacterial spot is associated with bacterial infection. It can spread through splashing water, contaminated tools and infected plant material.",

                treatment:
                    "Remove severely affected leaves when practical and dispose of infected plant material appropriately. Avoid handling wet plants. For chemical control, seek local agricultural advice before using any registered product.",

                prevention:
                    "Avoid overhead irrigation, provide adequate spacing, clean gardening tools and use disease-free seeds or seedlings."
            };
        }

        // Early blight
        if (name.includes("early blight")) {
            return {
                symptoms:
                    "Older leaves may develop brown spots with concentric ring patterns, sometimes surrounded by yellowing.",

                about:
                    "Early blight is a fungal disease commonly associated with Alternaria species. It can affect foliage and reduce plant vigour.",

                treatment:
                    "Remove badly affected leaves, clear fallen plant debris and avoid wetting foliage. Consult a local agricultural expert about suitable registered fungicides if the disease progresses.",

                prevention:
                    "Rotate crops, maintain good spacing, water near the soil and remove infected plant debris."
            };
        }

        // Late blight
        if (name.includes("late blight")) {
            return {
                symptoms:
                    "Irregular dark or water-soaked lesions may appear on leaves. Under humid conditions, pale growth may develop around affected areas.",

                about:
                    "Late blight is a serious disease caused by an organism called Phytophthora infestans. It can spread rapidly in cool, humid conditions.",

                treatment:
                    "Isolate affected plant material where possible and remove severely infected parts. Seek prompt local agricultural advice because late blight can spread quickly.",

                prevention:
                    "Use healthy planting material, avoid overhead watering, maintain airflow and monitor plants frequently during humid weather."
            };
        }

        // Powdery mildew
        if (name.includes("powdery mildew")) {
            return {
                symptoms:
                    "White or grey powder-like patches may develop on leaf surfaces. Affected leaves can become distorted or yellow.",

                about:
                    "Powdery mildew is a fungal disease that commonly appears as a powdery coating on leaves and other plant parts.",

                treatment:
                    "Remove heavily affected leaves when practical and improve airflow. Ask a local agricultural expert about appropriate registered treatments if symptoms continue.",

                prevention:
                    "Avoid overcrowding, maintain airflow, inspect plants regularly and remove infected plant debris."
            };
        }

        // Rust
        if (name.includes("rust")) {
            return {
                symptoms:
                    "Small yellow, orange, reddish or brown powdery spots may develop on leaves, often on the lower surface.",

                about:
                    "Rust diseases are caused by groups of fungi that produce characteristic coloured spore patches on plant tissues.",

                treatment:
                    "Remove heavily infected leaves when practical and dispose of them appropriately. Seek local advice if the infection continues to spread.",

                prevention:
                    "Maintain spacing, improve airflow, avoid prolonged leaf wetness and inspect plants regularly."
            };
        }

        // Leaf mold
        if (name.includes("leaf mold")) {
            return {
                symptoms:
                    "Yellow patches may appear on the upper leaf surface, with olive-green or greyish growth sometimes developing underneath.",

                about:
                    "Leaf mold is a fungal disease often encouraged by high humidity and poor air circulation, particularly in tomato plants.",

                treatment:
                    "Remove severely affected leaves and improve ventilation around the plant. Avoid prolonged leaf wetness.",

                prevention:
                    "Provide adequate spacing, improve airflow, water near the soil and monitor humidity."
            };
        }

        // Septoria leaf spot
        if (name.includes("septoria")) {
            return {
                symptoms:
                    "Small circular spots with pale or grey centres and darker borders may appear, often on older leaves.",

                about:
                    "Septoria leaf spot is a fungal disease that can cause leaf spotting and premature leaf drop.",

                treatment:
                    "Remove infected leaves where practical, clear fallen debris and avoid splashing water onto foliage. Seek local advice if the infection spreads.",

                prevention:
                    "Rotate crops, maintain good spacing, avoid overhead watering and remove infected plant debris."
            };
        }

        // Spider mites
        if (name.includes("spider mite")) {
            return {
                symptoms:
                    "Leaves may show tiny pale speckles, yellowing or bronzing. Fine webbing may be visible on heavily affected plants.",

                about:
                    "Spider mites are tiny plant-feeding pests that damage leaves by feeding on plant cells.",

                treatment:
                    "Inspect the undersides of leaves carefully. For a small infestation, washing leaf surfaces with water may help. Seek local advice for suitable pest management if the infestation persists.",

                prevention:
                    "Inspect plants regularly, reduce dust around growing areas and monitor the undersides of leaves."
            };
        }

        // Mosaic virus
        if (name.includes("mosaic virus")) {
            return {
                symptoms:
                    "Leaves may show irregular light and dark green patterns, mottling, distortion or unusual growth.",

                about:
                    "Mosaic symptoms can be associated with plant viruses. Several different viruses can cause similar visual patterns.",

                treatment:
                    "There is no general cure for a viral plant infection. Confirm the diagnosis with an agricultural expert and follow local guidance on managing infected plants.",

                prevention:
                    "Use healthy planting material, disinfect tools and manage insect vectors according to local agricultural recommendations."
            };
        }

        // Yellow leaf curl virus
        if (name.includes("yellow leaf curl")) {
            return {
                symptoms:
                    "Leaves may curl upward, become yellow, appear smaller and show reduced growth.",

                about:
                    "Tomato yellow leaf curl disease is a viral disease commonly associated with whitefly transmission.",

                treatment:
                    "There is no direct cure for an infected plant. Confirm the diagnosis and seek local agricultural advice about managing infected plants and whiteflies.",

                prevention:
                    "Use healthy seedlings, monitor whiteflies, remove weeds that may host pests and follow locally recommended pest-management practices."
            };
        }

        // Black rot
        if (name.includes("black rot")) {
            return {
                symptoms:
                    "Affected leaves may develop brown or dark lesions. The appearance can vary depending on the crop and stage of infection.",

                about:
                    "Black rot is a disease name used for different crop-specific infections. Accurate identification is important before choosing treatment.",

                treatment:
                    "Remove severely affected plant material where practical and seek crop-specific agricultural advice before applying any treatment.",

                prevention:
                    "Use healthy planting material, remove infected debris, maintain airflow and avoid unnecessary leaf wetness."
            };
        }

        // Citrus greening / Huanglongbing
        if (name.includes("huanglongbing")) {
            return {
                symptoms:
                    "Leaves may show uneven yellowing, blotchy mottling and reduced growth. Fruits can also become misshapen or develop uneven colouring.",

                about:
                    "Huanglongbing, also known as citrus greening, is a serious bacterial disease of citrus associated with psyllid insect vectors.",

                treatment:
                    "There is no established cure for an infected tree. Contact a local horticulture or plant protection authority for confirmation and management guidance.",

                prevention:
                    "Use certified disease-free planting material and monitor citrus psyllids. Follow local plant-health regulations and recommendations."
            };
        }

        // Generic fallback for other detected diseases
        return {
            symptoms:
                "The AI identified this image as " + disease + ". Symptoms vary by crop and disease, so inspect the leaves and other plant parts carefully.",

            about:
                "The predicted condition is associated with " + crop + ". The model's classification is an image-based prediction and is not a confirmed diagnosis.",

            treatment:
                "Remove severely damaged plant material when appropriate, keep the growing area clean and seek crop-specific advice from an agricultural expert before applying pesticides or other treatments.",

            prevention:
                "Use healthy planting material, maintain proper spacing, avoid excessive moisture on leaves, clean tools and monitor the plant regularly."
        };
    }


    // ==========================================
    // DISPLAY CARE GUIDE
    // ==========================================

    function displayCareGuide(crop, disease) {

        const guide = getCareGuide(crop, disease);

        if (careSymptoms) {
            careSymptoms.textContent = guide.symptoms;
        }

        if (careAbout) {
            careAbout.textContent = guide.about;
        }

        if (careTreatment) {
            careTreatment.textContent = guide.treatment;
        }

        if (carePrevention) {
            carePrevention.textContent = guide.prevention;
        }

        // Refresh Lucide icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }


    // ==========================================
    // RESULT PANEL HELPERS
    // ==========================================

    function resetResults() {

        emptyResult.hidden = true;
        loadingResult.hidden = true;
        actualResult.hidden = true;
        errorResult.hidden = true;

        if (confidenceFill) {
            confidenceFill.style.width = "0%";
        }
    }


    function showError(message) {

        resetResults();

        errorResult.hidden = false;

        errorMessage.textContent =
            message || "Something went wrong. Please try again.";

        if (window.lucide) {
            window.lucide.createIcons();
        }
    }


    // ==========================================
    // IMAGE PREVIEW
    // ==========================================

    function handleImage(file) {

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            showError("Please upload a valid image file.");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            showError("Image size must be less than 10 MB.");
            return;
        }

        // Release previous preview URL
        if (previewURL) {
            URL.revokeObjectURL(previewURL);
        }

        selectedFile = file;

        previewURL = URL.createObjectURL(file);

        leafPreview.src = previewURL;

        fileName.textContent = file.name;

        uploadZone.hidden = true;
        previewContainer.hidden = false;

        analyseButton.disabled = false;

        resetResults();

        emptyResult.hidden = false;

        if (window.lucide) {
            window.lucide.createIcons();
        }
    }


    // ==========================================
    // BROWSE IMAGE
    // ==========================================

    browseButton.addEventListener("click", () => {
        leafInput.click();
    });


    leafInput.addEventListener("change", (event) => {

        const file = event.target.files[0];

        if (file) {
            handleImage(file);
        }

    });


    // ==========================================
    // REMOVE IMAGE
    // ==========================================

    removeImage.addEventListener("click", () => {

        selectedFile = null;

        leafInput.value = "";

        leafPreview.src = "";

        if (previewURL) {
            URL.revokeObjectURL(previewURL);
            previewURL = null;
        }

        previewContainer.hidden = true;
        uploadZone.hidden = false;

        fileName.textContent = "No image selected";

        analyseButton.disabled = true;

        resetResults();

        emptyResult.hidden = false;

    });


    // ==========================================
    // DRAG AND DROP
    // ==========================================

    uploadZone.addEventListener("dragover", (event) => {

        event.preventDefault();

        uploadZone.classList.add("drag-active");

    });


    uploadZone.addEventListener("dragleave", () => {

        uploadZone.classList.remove("drag-active");

    });


    uploadZone.addEventListener("drop", (event) => {

        event.preventDefault();

        uploadZone.classList.remove("drag-active");

        const file = event.dataTransfer.files[0];

        if (file) {
            handleImage(file);
        }

    });


    // ==========================================
    // AI ANALYSIS
    // ==========================================

    analyseButton.addEventListener("click", async () => {

        if (!selectedFile) {
            showError("Please select a leaf image first.");
            return;
        }

        resetResults();

        loadingResult.hidden = false;

        analyseButton.disabled = true;

        analyseButton.textContent = "Analysing...";

        try {

            const formData = new FormData();

            formData.append("file", selectedFile);


            // Send image to Flask backend
           const response = await fetch("http://10.10.72.41:5000/predict", {
    method: "POST",
    body: formData
});

            const data = await response.json();


            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Unable to analyse the image."
                );
            }


            // Handle low-confidence predictions
            if (data.reliable_prediction === false) {

                showError(
                    data.message ||
                    "The AI could not identify this leaf confidently. Please try a clearer image."
                );

                return;
            }


            // Display AI prediction
            resultCrop.textContent = data.crop || "Unknown";

            resultDisease.textContent = data.disease || "Unknown";


            // Confidence display
            const confidence = Number(data.confidence);

            confidenceValue.textContent =
                Number.isFinite(confidence)
                    ? confidence.toFixed(2) + "%"
                    : "Unavailable";

            confidenceFill.style.width =
                Number.isFinite(confidence)
                    ? Math.max(0, Math.min(100, confidence)) + "%"
                    : "0%";


            // Show disease-specific care information
            displayCareGuide(
                data.crop || "Plant",
                data.disease || "Unknown"
            );


            loadingResult.hidden = true;

            actualResult.hidden = false;


        } catch (error) {

            console.error("PlantCare AI error:", error);

            showError(
                error.message ||
                "Unable to connect to the AI server. Please try again."
            );

        } finally {

            loadingResult.hidden = true;

            analyseButton.disabled = !selectedFile;

            analyseButton.innerHTML =
                'Analyse leaf <i data-lucide="arrow-right"></i>';

            if (window.lucide) {
                window.lucide.createIcons();
            }

        }

    });


    // ==========================================
    // NAVIGATION ACTIVE STATE
    // ==========================================

    const navItems = document.querySelectorAll(".nav-item");

    navItems.forEach((item) => {

        item.addEventListener("click", () => {

            navItems.forEach((nav) => {
                nav.classList.remove("active");
            });

            item.classList.add("active");

        });

    });


    // ==========================================
    // INITIALISE ICONS
    // ==========================================

    if (window.lucide) {
        window.lucide.createIcons();
    }

});
