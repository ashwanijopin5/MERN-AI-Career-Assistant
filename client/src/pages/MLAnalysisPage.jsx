import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Navbar from "@/components/shared/Navbar";
import axiosInstance from "@/utils/axios";

import {
    setCurrentAnalysis,
    setLoading
} from "@/redux/slices/analysisSlice";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Loader2 } from "lucide-react";

import { ANALYSIS_POINT } from "@/utils/constent";


function MLAnalysisPage() {

    const { id } = useParams();

    const dispatch = useDispatch();

    const {
        currentAnalysis,
        loading
    } = useSelector(
        state => state.analysis
    );

    useEffect(() => {

        const fetchAnalysis = async () => {

            dispatch(setLoading(true));

            try {

                const res =
                    await axiosInstance.get(
                        `${ANALYSIS_POINT}/${id}`
                    );

                dispatch(
                    setCurrentAnalysis(
                        res.data.analysis
                    )
                );

            } catch (error) {

                console.log(error);

            } finally {

                dispatch(setLoading(false));

            }
        };

        fetchAnalysis();

    }, [id]);

    if (
        loading ||
        !currentAnalysis
    ) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />

                <div className="flex justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            </div>
        );
    }

    const analysis = currentAnalysis;

    return (
        <div className="min-h-screen bg-slate-50">

            <Navbar />

            <main className="max-w-7xl mx-auto px-4 py-8">

                {/* Header */}

                <Card className="mb-6 border-blue-200">

                    <CardContent className="p-6">

                        <h1 className="text-3xl font-bold">
                            ML Resume Analysis
                        </h1>

                        <p className="text-slate-500 mt-2">
                            Machine Learning Based Resume Evaluation
                        </p>

                    </CardContent>

                </Card>

                {/* Score Cards */}

                <div className="grid md:grid-cols-3 gap-4 mb-6">

                    <Card>
                        <CardContent className="p-6 text-center">

                            <p className="text-slate-500 text-sm">
                                ML Score
                            </p>

                            <h2 className="text-4xl font-bold text-blue-600">
                                {analysis.mlScore || 0}%
                            </h2>

                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 text-center">

                            <p className="text-slate-500 text-sm">
                                Final Match
                            </p>

                            <h2 className="text-4xl font-bold text-green-600">
                                {analysis.finalMatchScore || 0}%
                            </h2>

                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 text-center">

                            <p className="text-slate-500 text-sm">
                                Similarity Score
                            </p>

                            <h2 className="text-4xl font-bold text-purple-600">
                                {analysis.similarityScore || 0}%
                            </h2>

                        </CardContent>
                    </Card>

                </div>

                {/* Breakdown */}

                <Card className="mb-6">

                    <CardHeader>
                        <CardTitle>
                            ML Breakdown
                        </CardTitle>
                    </CardHeader>

                    <CardContent>

                        <div className="space-y-4">

                            <div>
                                Skills:
                                {" "}
                                {analysis.mlBreakdown?.skills || 0}
                            </div>

                            <div>
                                Projects:
                                {" "}
                                {analysis.mlBreakdown?.projects || 0}
                            </div>

                            <div>
                                Education:
                                {" "}
                                {analysis.mlBreakdown?.education || 0}
                            </div>

                            <div>
                                Experience:
                                {" "}
                                {analysis.mlBreakdown?.experience || 0}
                            </div>

                            <div>
                                Presence:
                                {" "}
                                {analysis.mlBreakdown?.presence || 0}
                            </div>

                        </div>

                    </CardContent>

                </Card>

                {/* Terms */}

                <div className="grid lg:grid-cols-2 gap-6 mb-6">

                    <Card>

                        <CardHeader>
                            <CardTitle>
                                Common Terms
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="flex flex-wrap gap-2">

                            {analysis.commonTerms?.map(
                                (term, index) => (
                                    <Badge
                                        key={index}
                                        className="bg-green-100 text-green-700"
                                    >
                                        {term}
                                    </Badge>
                                )
                            )}

                        </CardContent>

                    </Card>

                    <Card>

                        <CardHeader>
                            <CardTitle>
                                Missing Terms
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="flex flex-wrap gap-2">

                            {analysis.missingTerms?.map(
                                (term, index) => (
                                    <Badge
                                        key={index}
                                        className="bg-red-100 text-red-700"
                                    >
                                        {term}
                                    </Badge>
                                )
                            )}

                        </CardContent>

                    </Card>

                </div>

                {/* Keyword Analysis */}

                <Card className="mb-6">

                    <CardHeader>
                        <CardTitle>
                            Keyword Coverage
                        </CardTitle>
                    </CardHeader>

                    <CardContent>

                        <div className="grid grid-cols-3 gap-4">

                            <div className="text-center">

                                <h3 className="text-2xl font-bold text-green-600">
                                    {analysis.keywordAnalysis?.matchedCount || 0}
                                </h3>

                                <p>Matched</p>

                            </div>

                            <div className="text-center">

                                <h3 className="text-2xl font-bold text-red-600">
                                    {analysis.keywordAnalysis?.missingCount || 0}
                                </h3>

                                <p>Missing</p>

                            </div>

                            <div className="text-center">

                                <h3 className="text-2xl font-bold">
                                    {analysis.keywordAnalysis?.totalJdKeywords || 0}
                                </h3>

                                <p>Total</p>

                            </div>

                        </div>

                    </CardContent>

                </Card>


                <Card className="mb-6">

                    <CardHeader>
                        <CardTitle>
                            Matched Keywords
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="flex flex-wrap gap-2">

                        {analysis.keywordAnalysis?.matched?.map(
                            (item, index) => (
                                <Badge
                                    key={index}
                                    className="bg-green-100 text-green-700"
                                >
                                    {item}
                                </Badge>
                            )
                        )}

                    </CardContent>

                </Card>
                {/* Feedback */}

                <Card className="mb-6">

                    <CardHeader>
                        <CardTitle>
                            ML Feedback
                        </CardTitle>
                    </CardHeader>

                    <CardContent>

                        <ul className="space-y-2">

                            {analysis.mlFeedback?.map(
                                (item, index) => (
                                    <li key={index}>
                                        • {item}
                                    </li>
                                )
                            )}

                        </ul>

                    </CardContent>

                </Card>

                {/* Recommendations */}

                <Card>

                    <CardHeader>
                        <CardTitle>
                            Recommendations
                        </CardTitle>
                    </CardHeader>

                    <CardContent>

                        {analysis.recommendations?.length > 0 ? (

                            <ul className="space-y-2">
                                {analysis.recommendations.map(
                                    (item, index) => (
                                        <li key={index}>
                                            • {item}
                                        </li>
                                    )
                                )}
                            </ul>

                        ) : (

                            <p className="text-slate-500">
                                No recommendations. Resume already matches most requirements.
                            </p>

                        )}

                    </CardContent>

                </Card>

            </main>

        </div>
    );
}

export default MLAnalysisPage;