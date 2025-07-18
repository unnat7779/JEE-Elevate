"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/Card"

export default function UploadQuestionsPage({ params }) {
  const router = useRouter()
  const [test, setTest] = useState(null)
  const [testId, setTestId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [progress, setProgress] = useState(0)
  const [extractedQuestions, setExtractedQuestions] = useState([])
  const fileInputRef = useRef(null)
  const [debugInfo, setDebugInfo] = useState(null)
  const [showSampleText, setShowSampleText] = useState(false)

  // Question configuration
  const [questionConfig, setQuestionConfig] = useState({
    subject: "Physics",
    chapter: "",
    difficulty: "Medium",
    positiveMarks: 4,
    negativeMarks: -1,
  })

  useEffect(() => {
    const resolvedParams = Promise.resolve(params)
    resolvedParams.then((p) => {
      setTestId(p.id)
      fetchTestDetails(p.id)
    })
  }, [params])

  const fetchTestDetails = async (id) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/admin/tests/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await response.json()
      if (response.ok) {
        setTest(data.test)
        setQuestionConfig((prev) => ({
          ...prev,
          subject: data.test.subject,
          chapter: data.test.chapter || "",
        }))
      } else {
        setError(data.error)
      }
    } catch (error) {
      setError("Failed to fetch test details")
    } finally {
      setLoading(false)
    }
  }

  const handleConfigChange = (e) => {
    const { name, value } = e.target
    setQuestionConfig((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError("")
    } else {
      setFile(null)
      setError("Please select a valid file")
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file")
      return
    }

    setUploading(true)
    setProgress(0)
    setExtractedQuestions([])
    setDebugInfo(null)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("config", JSON.stringify(questionConfig))

      const token = localStorage.getItem("token")

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 500)

      const response = await fetch(`/api/admin/tests/${testId}/questions/extract`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setExtractedQuestions(data.extractedQuestions || [])
      } else {
        setError(data.error || "Failed to extract questions")
        if (data.textSample) {
          setDebugInfo({
            textSample: data.textSample,
            message: "Text sample from the uploaded file:",
            suggestion: data.suggestion || "",
          })
        }
        if (data.stack) {
          console.error("Error stack:", data.stack)
        }
      }
    } catch (err) {
      setError("An error occurred while uploading the file")
      console.error("Upload error:", err)
    } finally {
      setUploading(false)
    }
  }

  const handleAddQuestionsToTest = async () => {
    if (extractedQuestions.length === 0) {
      setError("No questions to add")
      return
    }

    setUploading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/admin/tests/${testId}/questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ questions: extractedQuestions }),
      })

      const data = await response.json()
      if (response.ok) {
        setSuccess(true)
        router.push(`/admin/tests/${testId}/preview`)
      } else {
        setError(data.error || "Failed to add questions to test")
      }
    } catch (error) {
      setError("An error occurred while adding questions to the test")
    } finally {
      setUploading(false)
    }
  }

  const handlePreviewQuestions = () => {
    router.push(`/admin/tests/${testId}/preview`)
  }

  const handleCopyToClipboard = () => {
    const sampleText = `## PHYSICS QUESTIONS 
 
Question 1: [MCQ] [PHYSICS] [MEDIUM] [CHAPTER: Mechanics] 
A particle moves along the x-axis such that its position as a function of time is given by x(t) = 
4t³ - 6t² + 3t + 5, where x is in meters and t is in seconds. The acceleration of the particle at t 
= 2 seconds is: 
 
A) 36 m/s² 
B) 24 m/s² 
C) 48 m/s² 
D) 12 m/s² 
 
Correct Answer: B 
 
Explanation: The position function is x(t) = 4t³ - 6t² + 3t + 5. To find acceleration, we need to 
differentiate twice. First derivative (velocity): v(t) = 12t² - 12t + 3. Second derivative 
(acceleration): a(t) = 24t - 12. At t = 2 seconds, a(2) = 24(2) - 12 = 48 - 12 = 36 m/s². 
 
--- 
 
Question 2: [NUMERICAL] [PHYSICS] [MEDIUM] [CHAPTER: Thermodynamics] 
A heat engine operates between temperatures 127°C and 27°C. If it absorbs 600 J of heat 
from the hot reservoir in each cycle, the maximum work (in joules) that can be extracted in 
each cycle is: 
 
Correct Answer: 200 
 
Explanation: The maximum efficiency of a heat engine is given by η = 1 - T₂/T₁, where T₁ = 
127 + 273 = 400 K and T₂ = 27 + 273 = 300 K. Therefore, η = 1 - 300/400 = 0.25 or 25%. 
The maximum work is W = η × Q₁ = 0.25 × 600 J = 150 J.`

    navigator.clipboard
      .writeText(sampleText)
      .then(() => {
        alert("Sample text copied to clipboard!")
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err)
        alert("Failed to copy text. Please try again.")
      })
  }

  const handleDownloadSampleTxt = () => {
    const sampleText = `## PHYSICS QUESTIONS 
 
Question 1: [MCQ] [PHYSICS] [MEDIUM] [CHAPTER: Mechanics] 
A particle moves along the x-axis such that its position as a function of time is given by x(t) = 
4t³ - 6t² + 3t + 5, where x is in meters and t is in seconds. The acceleration of the particle at t 
= 2 seconds is: 
 
A) 36 m/s² 
B) 24 m/s² 
C) 48 m/s² 
D) 12 m/s² 
 
Correct Answer: B 
 
Explanation: The position function is x(t) = 4t³ - 6t² + 3t + 5. To find acceleration, we need to 
differentiate twice. First derivative (velocity): v(t) = 12t² - 12t + 3. Second derivative 
(acceleration): a(t) = 24t - 12. At t = 2 seconds, a(2) = 24(2) - 12 = 48 - 12 = 36 m/s². 
 
--- 
 
Question 2: [NUMERICAL] [PHYSICS] [MEDIUM] [CHAPTER: Thermodynamics] 
A heat engine operates between temperatures 127°C and 27°C. If it absorbs 600 J of heat 
from the hot reservoir in each cycle, the maximum work (in joules) that can be extracted in 
each cycle is: 
 
Correct Answer: 200 
 
Explanation: The maximum efficiency of a heat engine is given by η = 1 - T₂/T₁, where T₁ = 
127 + 273 = 400 K and T₂ = 27 + 273 = 300 K. Therefore, η = 1 - 300/400 = 0.25 or 25%. 
The maximum work is W = η × Q₁ = 0.25 × 600 J = 150 J.`

    const blob = new Blob([sampleText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "sample-questions.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Upload Questions</h1>
          <p className="mt-2 text-gray-600">Upload questions for {test?.title}</p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
            Questions extracted successfully! {extractedQuestions.length} questions have been extracted.
          </div>
        )}

        <div className="space-y-6">
          {/* Question Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Default Question Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                These settings will be used as defaults for extracted questions if not specified in the file.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Subject</label>
                  <select
                    name="subject"
                    value={questionConfig.subject}
                    onChange={handleConfigChange}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                  </select>
                </div>

                <Input
                  label="Chapter"
                  name="chapter"
                  value={questionConfig.chapter}
                  onChange={handleConfigChange}
                  placeholder="Enter chapter name"
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Difficulty</label>
                  <select
                    name="difficulty"
                    value={questionConfig.difficulty}
                    onChange={handleConfigChange}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Positive Marks"
                    name="positiveMarks"
                    type="number"
                    value={questionConfig.positiveMarks}
                    onChange={handleConfigChange}
                  />
                  <Input
                    label="Negative Marks"
                    name="negativeMarks"
                    type="number"
                    value={questionConfig.negativeMarks}
                    onChange={handleConfigChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Questions File</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <h3 className="font-medium text-yellow-800 mb-2">Important Note</h3>
                  <p className="text-yellow-700 text-sm mb-2">
                    For best results, please upload a <strong>text (.txt) file</strong> with your questions. PDF
                    extraction may not work correctly with all PDF files.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Button onClick={handleDownloadSampleTxt} variant="outline" size="sm">
                      Download Sample TXT
                    </Button>
                    <Button onClick={handleCopyToClipboard} variant="outline" size="sm">
                      Copy Sample Format
                    </Button>
                    <Button onClick={() => setShowSampleText(!showSampleText)} variant="outline" size="sm">
                      {showSampleText ? "Hide Sample" : "Show Sample"}
                    </Button>
                  </div>
                </div>

                {showSampleText && (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                    <h4 className="font-medium text-gray-800 mb-2">Sample Question Format</h4>
                    <pre className="text-xs bg-white p-3 rounded overflow-auto max-h-60 border">
                      {`## PHYSICS QUESTIONS 
 
Question 1: [MCQ] [PHYSICS] [MEDIUM] [CHAPTER: Mechanics] 
A particle moves along the x-axis such that its position as a function of time is given by x(t) = 
4t³ - 6t² + 3t + 5, where x is in meters and t is in seconds. The acceleration of the particle at t 
= 2 seconds is: 
 
A) 36 m/s² 
B) 24 m/s² 
C) 48 m/s² 
D) 12 m/s² 
 
Correct Answer: B 
 
Explanation: The position function is x(t) = 4t³ - 6t² + 3t + 5. To find acceleration, we need to 
differentiate twice. First derivative (velocity): v(t) = 12t² - 12t + 3. Second derivative 
(acceleration): a(t) = 24t - 12. At t = 2 seconds, a(2) = 24(2) - 12 = 48 - 12 = 36 m/s². 
 
--- 
 
Question 2: [NUMERICAL] [PHYSICS] [MEDIUM] [CHAPTER: Thermodynamics] 
A heat engine operates between temperatures 127°C and 27°C. If it absorbs 600 J of heat 
from the hot reservoir in each cycle, the maximum work (in joules) that can be extracted in 
each cycle is: 
 
Correct Answer: 200 
 
Explanation: The maximum efficiency of a heat engine is given by η = 1 - T₂/T₁, where T₁ = 
127 + 273 = 400 K and T₂ = 27 + 273 = 300 K. Therefore, η = 1 - 300/400 = 0.25 or 25%. 
The maximum work is W = η × Q₁ = 0.25 × 600 J = 150 J.`}
                    </pre>
                  </div>
                )}

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <h3 className="font-medium text-blue-800 mb-2">Format Instructions</h3>
                  <p className="text-blue-700 text-sm mb-2">
                    Your file should follow this format for best extraction results:
                  </p>
                  <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                    <li>Start each question with "Question X:" where X is the question number</li>
                    <li>Specify question type: [MCQ] or [NUMERICAL]</li>
                    <li>Specify subject: [PHYSICS], [CHEMISTRY], or [MATHEMATICS]</li>
                    <li>Specify difficulty: [EASY], [MEDIUM], or [HARD]</li>
                    <li>For MCQ questions, provide 4 options labeled A), B), C), D)</li>
                    <li>End with "Correct Answer: X" where X is the answer</li>
                  </ul>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept=".txt,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    ref={fileInputRef}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="space-y-2">
                      <div className="flex justify-center">
                        <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                      </div>
                      <div className="text-gray-600">{file ? file.name : "Click to select file or drag and drop"}</div>
                      <div className="text-xs text-gray-500">Supported formats: .txt (recommended), .pdf</div>
                    </div>
                  </label>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                {debugInfo && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <h4 className="font-medium text-yellow-800 mb-2">{debugInfo.message}</h4>
                    {debugInfo.suggestion && <p className="text-sm text-yellow-700 mb-2">{debugInfo.suggestion}</p>}
                    <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">{debugInfo.textSample}</pre>
                  </div>
                )}

                {uploading && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                    <p className="text-sm text-gray-600 mt-1 text-center">{progress}% - Extracting questions...</p>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button onClick={() => router.push(`/admin/tests/${testId}/questions/manual`)} variant="outline">
                    Manual Entry Instead
                  </Button>

                  <Button onClick={handleUpload} disabled={!file || uploading}>
                    {uploading ? "Processing..." : "Upload & Extract Questions"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Extracted Questions Summary */}
          {extractedQuestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Extracted Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-700">
                      <span className="font-medium">{extractedQuestions.length} questions</span> have been successfully
                      extracted. Click "Add to Test" to add these questions to your test.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 border rounded-md text-center">
                      <div className="text-lg font-medium text-blue-600">
                        {extractedQuestions.filter((q) => q.questionType === "mcq").length}
                      </div>
                      <div className="text-sm text-gray-600">MCQ Questions</div>
                    </div>
                    <div className="p-4 bg-gray-50 border rounded-md text-center">
                      <div className="text-lg font-medium text-green-600">
                        {extractedQuestions.filter((q) => q.questionType === "numerical").length}
                      </div>
                      <div className="text-sm text-gray-600">Numerical Questions</div>
                    </div>
                    <div className="p-4 bg-gray-50 border rounded-md text-center">
                      <div className="text-lg font-medium text-purple-600">
                        {extractedQuestions.reduce((acc, q) => acc + (q.marks?.positive || 4), 0)}
                      </div>
                      <div className="text-sm text-gray-600">Total Marks</div>
                    </div>
                  </div>

                  {/* Subject-wise breakdown */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-700">Subject-wise Breakdown:</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {["Physics", "Chemistry", "Mathematics"].map((subject) => {
                        const count = extractedQuestions.filter((q) => q.subject === subject).length
                        return count > 0 ? (
                          <div key={subject} className="flex justify-between items-center p-2 bg-white border rounded">
                            <span className="text-sm font-medium">{subject}:</span>
                            <span className="text-sm text-gray-600">{count} questions</span>
                          </div>
                        ) : null
                      })}
                    </div>
                  </div>

                  {/* Preview first few questions */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-700">Preview (First 3 Questions):</h4>
                    {extractedQuestions.slice(0, 3).map((question, index) => (
                      <div key={index} className="p-3 bg-white border rounded-md">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium">Question {index + 1}</span>
                          <div className="flex space-x-1">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                              {question.questionType === "mcq" ? "MCQ" : "Numerical"}
                            </span>
                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                              {question.subject}
                            </span>
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                              {question.difficulty}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2">{question.questionText}</p>
                        {question.questionType === "mcq" && question.options && (
                          <div className="mt-2 text-xs text-gray-500">
                            Correct Answer: Option {String.fromCharCode(65 + question.correctAnswer)}
                          </div>
                        )}
                        {question.questionType === "numerical" && (
                          <div className="mt-2 text-xs text-gray-500">Correct Answer: {question.numericalAnswer}</div>
                        )}
                      </div>
                    ))}
                    {extractedQuestions.length > 3 && (
                      <p className="text-sm text-gray-500 text-center">
                        ... and {extractedQuestions.length - 3} more questions
                      </p>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex justify-between pt-4 border-t">
                    <Button onClick={() => router.push(`/admin/tests/${testId}`)} variant="outline">
                      Back to Test
                    </Button>
                    <div className="space-x-2">
                      <Button onClick={handleAddQuestionsToTest} variant="primary">
                        Add to Test
                      </Button>
                      <Button onClick={() => setExtractedQuestions([])} variant="outline">
                        Clear Questions
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
