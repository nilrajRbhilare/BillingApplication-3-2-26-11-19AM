import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Upload,
    ChevronRight,
    HelpCircle,
    ChevronDown,
    ArrowLeft,
    FileUp
} from "lucide-react";
import { Link } from "wouter";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function ImportStatement() {
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const steps = [
        { id: 1, label: "Configure", active: true },
        { id: 2, label: "Map Fields", active: false },
        { id: 3, label: "Preview", active: false },
    ];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            validateAndSetFile(file);
        }
    };

    const validateAndSetFile = (file: File) => {
        const validTypes = ['.csv', '.tsv', '.xls', '.xlsx', '.ofx', '.qif', '.pdf'];
        const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

        if (!validTypes.includes(extension)) {
            toast({
                title: "Invalid file type",
                description: "Please upload a supported bank statement file.",
                variant: "destructive"
            });
            return;
        }

        setSelectedFile(file);
        toast({
            title: "File selected",
            description: `${file.name} is ready for import.`,
        });
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            validateAndSetFile(file);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50">
            <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
                <div className="flex items-center gap-4">
                    <Link href="/banking">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-xl font-semibold">Import Statements for HDFC</h1>
                </div>
            </header>

            <main className="flex-1 p-8 overflow-auto">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Stepper */}
                    <div className="flex items-center justify-center gap-4">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${step.active ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"
                                        }`}>
                                        {step.id}
                                    </div>
                                    <span className={`text-sm font-medium ${step.active ? "text-slate-900" : "text-slate-500"
                                        }`}>
                                        {step.label}
                                    </span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className="w-12 h-[1px] bg-slate-200" />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Upload Section */}
                    <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".csv,.tsv,.xls,.xlsx,.ofx,.qif,.pdf"
                    />

                    <Card
                        className={`p-12 border-dashed border-2 transition-colors flex flex-col items-center justify-center text-center space-y-6 ${isDragging ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white"
                            } ${selectedFile ? "border-green-500 bg-green-50" : ""}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <div className={`h-16 w-16 rounded-full flex items-center justify-center ${selectedFile ? "bg-green-100" : "bg-slate-50"
                            }`}>
                            {selectedFile ? (
                                <FileUp className="h-8 w-8 text-green-600" />
                            ) : (
                                <Upload className="h-8 w-8 text-slate-400" />
                            )}
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-lg font-semibold text-slate-900">
                                {selectedFile ? selectedFile.name : "Drag and drop file to import"}
                            </h2>
                            <div className="flex items-center justify-center gap-2">
                                <Button
                                    className="bg-blue-600 hover:bg-blue-700"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload className="h-4 w-4 mr-2" />
                                    {selectedFile ? "Change File" : "Choose File"}
                                    <ChevronDown className="h-4 w-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                                <HelpCircle className="h-4 w-4" />
                                <span>Bank statement imported till 28/01/2024</span>
                            </div>
                            <p className="text-[11px] text-slate-400">
                                Maximum File Size: 1 MB for CSV, TSV, XLS, OFX, QIF, CAMT.053 and CAMT.054 • 5 MB for PDF files.
                            </p>
                        </div>
                    </Card>

                    {/* Format Info */}
                    <div className="space-y-4">
                        <p className="text-sm text-slate-600">
                            Ensure that the import file is in the correct format by comparing it with our sample file.
                        </p>
                        <Button variant="link" className="text-blue-600 p-0 h-auto font-medium">
                            Download sample file
                            <ChevronDown className="h-4 w-4 ml-1" />
                        </Button>

                        <div className="grid grid-cols-2 gap-8 pt-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                                    Character Encoding
                                    <HelpCircle className="h-3 w-3 text-slate-400" />
                                </label>
                                <Select defaultValue="utf8">
                                    <SelectTrigger className="w-full bg-white">
                                        <SelectValue placeholder="Select encoding" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="utf8">UTF-8 (Unicode)</SelectItem>
                                        <SelectItem value="utf16">UTF-16</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Next Button Section */}
                    <div className="flex justify-end pt-4 border-t">
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 px-8"
                            disabled={!selectedFile}
                            onClick={() => {
                                toast({
                                    title: "Moving to next step",
                                    description: "Mapping fields...",
                                });
                            }}
                        >
                            Next
                        </Button>
                    </div>

                    {/* Page Tips */}
                    <Card className="p-6 bg-slate-50/50 border-none shadow-none space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded bg-yellow-100 flex items-center justify-center">
                                <span className="text-yellow-700 text-sm">💡</span>
                            </div>
                            <h3 className="font-semibold text-slate-900">Page Tips</h3>
                        </div>
                        <ul className="space-y-3 text-sm text-slate-600 list-disc pl-5">
                            <li>If you have files in other formats, you can convert it to an accepted file format using any online/offline converter.</li>
                        </ul>
                    </Card>
                </div>
            </main>
        </div>
    );
}

