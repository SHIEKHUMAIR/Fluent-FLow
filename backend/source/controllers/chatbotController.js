const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const generateRoadmap = async (req, res) => {
  try {
    const userId = req.user.id;
    const answers = req.body.answers;

    if (!answers) {
      return res.status(400).json({ message: "Answers are required" });
    }

    // Create a temporary file for answers
    const tempDir = path.join(__dirname, '..', '..', 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    
    // Cleanup old temp files (optional, simple maintenance)
    // fs.readdir(tempDir, (err, files) => {
    //   if (err) return;
    //   files.forEach(file => { ... });
    // });

    const timestamp = Date.now();
    const answersFilePath = path.join(tempDir, `answers_${userId}_${timestamp}.json`);
    const outputPdfPath = path.join(tempDir, `roadmap_${userId}_${timestamp}.pdf`);

    // Write answers to JSON file
    fs.writeFileSync(answersFilePath, JSON.stringify(answers));

    // Path to Python script
    // Assumes backend/source/controllers is location, so we go up 3 levels to root
    const rootDir = path.join(__dirname, '..', '..', '..');
    const pythonScriptPath = path.join(rootDir, 'chatbot', 'roadmap_generator.py');

    // Determine Backend URL
    const protocol = req.protocol;
    const host = req.get('host');
    const backendUrl = `${protocol}://${host}`;

    // Spawn Python process
    const pythonProcess = spawn('python', [
      pythonScriptPath,
      '--user_id', userId,
      '--answers', answersFilePath,
      '--output', outputPdfPath,
      '--backend_url', backendUrl
    ]);

    pythonProcess.stdout.on('data', (data) => {
      console.log(`Python stdout: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python stderr: ${data}`);
    });

    pythonProcess.on('error', (err) => {
      console.error('Failed to start python process:', err);
      // Ensure we don't send double response if close happens too
      if (!res.headersSent) {
          res.status(500).json({ message: "Failed to start roadmap generation process" });
      }
    });

    pythonProcess.on('close', (code) => {
      // Cleanup answers file
      try {
        fs.unlinkSync(answersFilePath);
      } catch (e) { console.error("Failed to delete temp answers file", e); }

      if (code !== 0) {
        return res.status(500).json({ message: "Failed to generate roadmap" });
      }

      // Check if PDF exists
      if (fs.existsSync(outputPdfPath)) {
        // Stream the PDF back
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=learning_roadmap.pdf');
        
        const fileStream = fs.createReadStream(outputPdfPath);
        fileStream.pipe(res);

        fileStream.on('end', () => {
          // Cleanup PDF file after sending
          try {
             fs.unlinkSync(outputPdfPath);
          } catch(e) { console.error("Failed to delete temp pdf", e); }
        });
      } else {
        res.status(500).json({ message: "PDF generation failed (output not found)" });
      }
    });

  } catch (error) {
    console.error("Error in generateRoadmap:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { generateRoadmap };
