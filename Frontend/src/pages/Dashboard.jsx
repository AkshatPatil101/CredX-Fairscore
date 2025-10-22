import React, { useState } from "react";
import {
  Home,
  FileText,
  Users,
  BarChart3,
  Settings,
  Search,
  Bell,
  Mail,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  User,
  Briefcase,
  DollarSign,
  MapPin,
  Target,
  Shield,
  Award,
  Activity,
  Layers,
  Zap,
  CreditCard,
  MessageSquare,
  AtSign,
  LogOut,
  List,
} from "lucide-react";
import {
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useNavigate } from "react-router-dom";
import logo from "./logo.png";
import { GetInputPage } from "./getInputPage";

export default function App() {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [inputsTaken, setInputsTaken] = useState(false);
  const [isChangingData, setIsChangingData] = useState(false);

  const [rawInputData, setRawInputData] = useState(null);

  const [mockData, setMockData] = useState({
    success: true,
    applicant_profile: {
      age: 35,
      gender: "Male",
      region: "South",
      employment: "Salaried",
      monthly_income: 80000,
    },
    final_decision: {
      approved: true,
      credit_score: 525,
      risk_category: "Very Poor",
      default_risk: 0.2484642863273621,
      approval_probability: 0.7153571367263794,
      threshold: 0.6,
    },
    model_predictions: [],
    consensus: {},
    positive_factors: [
      {
        text: "Low credit utilization (using < 30% of available credit)",
        type: "positive",
      },
      { text: "Good savings ratio (saving > 20% of income)", type: "positive" },
      { text: "Strong digital payment activity", type: "positive" },
      { text: "Stable income source", type: "positive" },
      { text: "Established credit history ( > 3 years)", type: "positive" },
    ],
    negative_factors: [
      { text: "1000 missed payments recorded", type: "negative" },
    ],
    recommendations: [
      "• Focus on improving payment history (make all payments on time)",
      "• Reduce credit utilization ratio (ideally below 30%)",
    ],
    all_predictions: {
      "Region-Aware XGBoost": {
        risk_color: "#27ae60",
      },
      "Fair XGBoost": {
        risk_color: "#27ae60",
      },
    },
    colour: "#27ae60",
    name: "keto",
  });

  const probabilityPieData = [
    {
      name: "Approval Probability",
      value: mockData.final_decision.approval_probability,
      fill: "#27ae60",
    },
    {
      name: "Default Risk",
      value: mockData.final_decision.default_risk,
      fill: "#e74c3c",
    },
  ];

  const creditScoreData = [
    {
      name: "Score",
      value: mockData.final_decision.credit_score,
      fill: mockData.colour,
    },
  ];

  const handleChangeInputClick = () => {
    setIsChangingData(true);
    setInputsTaken(false);
  };

  if (!inputsTaken) {
    return (
      <GetInputPage
        setInputsTaken={setInputsTaken}
        setMockData={setMockData}
        setRawInputData={setRawInputData}
        initialData={rawInputData}
        startWithFormOpen={isChangingData}
      />
    );
  }

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white overflow-hidden">
      <aside className="w-20 bg-[#141414] flex flex-col items-center py-3 pl-2 border-r border-white/5">
        <img src={logo} alt="logo" className="mb-12" />
        <nav className="flex-1 flex flex-col gap-8">
          <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#1A1A1A] text-white">
            <Home className="w-6 h-6" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-600 hover:text-white">
            <CreditCard className="w-6 h-6" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-600 hover:text-white">
            <FileText className="w-6 h-6" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-600 hover:text-white">
            <MessageSquare className="w-6 h-6" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-600 hover:text-white">
            <AtSign className="w-6 h-6" />
          </button>
        </nav>
        <button className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-600 hover:text-white mb-4">
          <Settings className="w-6 h-6" />
        </button>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-20 flex items-center justify-between px-8 border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-xl relative z-30">
          <div>
            <h1 className="text-xl font-semibold text-white">
              Credit Score Prediction
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              AI-Powered Credit Assessment Dashboard
            </p>
          </div>

          <div className="flex items-center gap-6">
            <button className="btn" onClick={handleChangeInputClick}>
              Change Input Data
            </button>

            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1A1A1A] border border-white/5 relative hover:border-white/10 transition-colors">
              <Bell className="w-5 h-5 text-white" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#FFA384] rounded-full"></span>
            </button>

            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1A1A1A] border border-white/5 hover:border-white/10 transition-colors">
              <Mail className="w-5 h-5 text-white" />
            </button>

            <div className="relative">
              <button
                onClick={() => setProfileOpen((prev) => !prev)}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFA384] to-[#FFB59A] flex items-center justify-center"
              >
                <span className="text-black font-semibold">
                  <User className="w-6 h-6 text-black" />
                </span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-14 w-64 bg-[#1A1A1A] border border-white/5 rounded-2xl shadow-lg p-4 z-50">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFA384] to-[#FFB59A] flex items-center justify-center flex-shrink-0">
                      <span className="text-black font-semibold">
                        <User className="w-5 h-5 text-black" />
                      </span>
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium text-white truncate">
                        Guest User
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate("/")}
                    className="w-full py-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Exit to Home
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 grid grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-[#141414] to-[#1A1A1A] rounded-3xl p-6 border border-white/5 relative overflow-hidden">
                <div
                  className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br to-transparent rounded-full blur-3xl"
                  style={{
                    backgroundColor: mockData.colour,
                    opacity: 0.1,
                  }}
                ></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center border"
                      style={{
                        backgroundColor: `${mockData.colour}1A`,
                        borderColor: `${mockData.colour}33`,
                      }}
                    >
                      <Target
                        className="w-5 h-5"
                        style={{ color: mockData.colour }}
                      />
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        mockData.final_decision.approved
                          ? "bg-green-500/10 text-green-500 border border-green-500/20"
                          : "bg-red-500/10 text-red-500 border border-red-500/20"
                      }`}
                    >
                      {mockData.final_decision.approved
                        ? "APPROVED"
                        : "REJECTED"}
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm font-medium mb-2">
                    Credit Score
                  </p>
                  <p className="text-4xl font-bold text-white mb-1">
                    {mockData.final_decision.credit_score}
                  </p>
                  <p className="text-gray-500 text-xs">out of 850</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#141414] to-[#1A1A1A] rounded-3xl p-6 border border-white/5 relative overflow-hidden">
                <div
                  className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br to-transparent rounded-full blur-3xl"
                  style={{
                    backgroundColor: mockData.colour,
                    opacity: 0.1,
                  }}
                ></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center border"
                      style={{
                        backgroundColor: `${mockData.colour}1A`,
                        borderColor: `${mockData.colour}33`,
                      }}
                    >
                      <Shield
                        className="w-5 h-5"
                        style={{ color: mockData.colour }}
                      />
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm font-medium mb-2">
                    Risk Category
                  </p>
                  <p
                    className="text-4xl font-bold mb-1"
                    style={{ color: mockData.colour }}
                  >
                    {mockData.final_decision.risk_category}
                  </p>
                  <p className="text-gray-500 text-xs">
                    Default Risk:{" "}
                    {(mockData.final_decision.default_risk * 100).toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="col-span-3 flex flex-col gap-6">
              <div className="bg-[#141414] rounded-3xl p-6 border border-white/5">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#FFA384]" />
                  Applicant Profile
                </h3>
                <div className="flex flex-col items-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FFA384] to-[#FFB59A] flex items-center justify-center mb-3">
                    <User className="w-10 h-10 text-black" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {mockData.name}
                  </h3>
                  <p className="text-gray-500 text-sm">Assessment Complete</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-[#1A1A1A] rounded-xl border border-white/5">
                    <User className="w-4 h-4 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-gray-500 text-xs">Age</p>
                      <p className="text-white text-sm">
                        {mockData.applicant_profile.age} years
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#1A1A1A] rounded-xl border border-white/5">
                    <User className="w-4 h-4 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-gray-500 text-xs">Gender</p>
                      <p className="text-white text-sm">
                        {mockData.applicant_profile.gender}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#1A1A1A] rounded-xl border border-white/5">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-gray-500 text-xs">Region</p>
                      <p className="text-white text-sm">
                        {mockData.applicant_profile.region}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#1A1A1A] rounded-xl border border-white/5">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-gray-500 text-xs">Employment</p>
                      <p className="text-white text-sm">
                        {mockData.applicant_profile.employment}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#1A1A1A] rounded-xl border border-white/5">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-gray-500 text-xs">Monthly Income</p>
                      <p className="text-white text-sm">
                        ₹
                        {mockData.applicant_profile.monthly_income.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#141414] rounded-3xl p-6 border border-white/5">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#FFA384]" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  {mockData.final_decision.approved ? (
                    <button className="w-full py-3 bg-gradient-to-r from-[#FFA384] to-[#FFB59A] rounded-xl text-black hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      Approve Application
                    </button>
                  ) : (
                    <button className="w-full py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                      <XCircle className="w-4 h-4" />
                      Reject Application
                    </button>
                  )}
                  <button className="w-full py-3 bg-[#1A1A1A] rounded-xl text-white border border-white/5 hover:bg-[#222222] transition-colors text-sm font-medium">
                    Request More Info
                  </button>
                  <button className="w-full py-3 bg-[#1A1A1A] rounded-xl text-gray-400 border border-white/5 hover:bg-[#222222] transition-colors text-sm font-medium">
                    Generate Report
                  </button>
                </div>
              </div>
            </div>

            <div className="col-span-5 flex flex-col gap-6">
              <div className="bg-[#141414] rounded-3xl p-6 border border-white/5">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#FFA384]" />
                  Credit Score Analysis
                </h3>

                <div className="flex items-center gap-8">
                  <div className="flex-1">
                    <div className="relative w-48 h-48 mx-auto">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                          cx="50%"
                          cy="50%"
                          innerRadius="70%"
                          outerRadius="100%"
                          data={creditScoreData}
                          startAngle={180}
                          endAngle={0}
                        >
                          <RadialBar
                            background={{ fill: "#1A1A1A" }}
                            dataKey="value"
                            cornerRadius={10}
                            fill={creditScoreData[0].fill}
                          />
                        </RadialBarChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-bold text-white mb-1">
                          {mockData.final_decision.credit_score}
                        </span>
                        <span
                          className="text-sm"
                          style={{ color: mockData.colour }}
                        >
                          {mockData.final_decision.risk_category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="p-4 bg-[#1A1A1A] rounded-xl border border-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-sm font-medium">
                          Final Decision
                        </span>
                        {mockData.final_decision.approved ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                      <p
                        className={`text-xl font-semibold ${
                          mockData.final_decision.approved
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {mockData.final_decision.approved
                          ? "APPROVED"
                          : "REJECTED"}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-[#1A1A1A] rounded-xl border border-white/5">
                        <TrendingDown className="w-4 h-4 text-[#FFA384] mb-2" />
                        <p className="text-gray-500 text-xs">Default Risk</p>
                        <p className="text-white text-sm">
                          {(mockData.final_decision.default_risk * 100).toFixed(
                            2,
                          )}
                          %
                        </p>
                      </div>

                      <div className="p-3 bg-[#1A1A1A] rounded-xl border border-white/5">
                        <TrendingUp className="w-4 h-4 text-green-500 mb-2" />
                        <p className="text-gray-500 text-xs">Approval Rate</p>
                        <p className="text-white text-sm">
                          {(
                            mockData.final_decision.approval_probability * 100
                          ).toFixed(1)}
                          %
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative mt-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500 text-xs">300</span>
                    <span className="text-gray-500 text-xs">500</span>
                    <span className="text-gray-500 text-xs">650</span>
                    <span className="text-gray-500 text-xs">750</span>
                    <span className="text-gray-500 text-xs">850</span>
                  </div>
                  <div className="w-full h-3 rounded-full overflow-hidden flex">
                    <div className="flex-1 bg-red-500"></div>
                    <div className="flex-1 bg-orange-500"></div>
                    <div className="flex-1 bg-yellow-500"></div>
                    <div className="flex-1 bg-green-500"></div>
                  </div>

                  <div
                    className="absolute top-0 w-1 h-8 bg-white rounded-full shadow-lg transform -translate-x-1/2"
                    style={{
                      left: `${(() => {
                        const score = mockData.final_decision.credit_score;
                        if (score <= 300) return 0;
                        if (score >= 850) return 100;

                        let percentage = 0;
                        if (score <= 500) {
                          percentage = ((score - 300) / 200) * 25;
                        } else if (score <= 650) {
                          percentage = 25 + ((score - 500) / 150) * 25;
                        } else if (score <= 750) {
                          percentage = 50 + ((score - 650) / 100) * 25;
                        } else {
                          percentage = 75 + ((score - 750) / 100) * 25;
                        }
                        return percentage;
                      })()}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="bg-[#141414] rounded-3xl p-6 border border-white/5">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <List className="w-5 h-5 text-[#FFA384]" />
                  Strong Key Factors
                </h3>

                <div className="mb-6">
                  <h4 className="text-sm font-medium text-red-500 mb-3">
                    Negative Factors
                  </h4>
                  <div className="space-y-3">
                    {mockData.negative_factors.length > 0 ? (
                      mockData.negative_factors.map((factor, idx) => (
                        <div
                          key={`neg-${idx}`}
                          className="flex items-start gap-3 p-3 bg-red-500/10 rounded-xl border border-red-500/20"
                        >
                          <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-red-500/10">
                            <XCircle className="w-3 h-3 text-red-500" />
                          </div>
                          <p className="text-gray-300 text-sm flex-1">
                            {factor.text}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm italic">
                        No negative factors found.
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-green-500 mb-3">
                    Positive Factors
                  </h4>
                  <div className="space-y-3">
                    {mockData.positive_factors.length > 0 ? (
                      mockData.positive_factors.map((factor, idx) => (
                        <div
                          key={`pos-${idx}`}
                          className="flex items-start gap-3 p-3 bg-green-500/10 rounded-xl border border-green-500/20"
                        >
                          <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-green-500/10">
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                          </div>
                          <p className="text-gray-300 text-sm flex-1">
                            {factor.text}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm italic">
                        No positive factors found.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-4 flex flex-col gap-6">
              <div className="bg-[#141414] rounded-3xl p-6 border border-white/5">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-[#FFA384]" />
                  Decision Summary
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-[#1A1A1A] rounded-xl border border-white/5 text-center">
                      <p className="text-gray-500 text-xs mb-1">
                        Approval Prob.
                      </p>
                      <p className="text-green-500 text-2xl font-semibold">
                        {(
                          mockData.final_decision.approval_probability * 100
                        ).toFixed(0)}
                        %
                      </p>
                    </div>

                    <div className="p-3 bg-[#1A1A1A] rounded-xl border border-white/5 text-center">
                      <p className="text-gray-500 text-xs mb-1">Default Risk</p>
                      <p
                        className={`text-2xl font-semibold ${
                          mockData.final_decision.default_risk > 0.5
                            ? "text-red-500"
                            : mockData.final_decision.default_risk > 0.2
                            ? "text-yellow-500"
                            : "text-green-500"
                        }`}
                      >
                        {(mockData.final_decision.default_risk * 100).toFixed(
                          0,
                        )}
                        %
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#141414] rounded-3xl p-6 border border-white/5">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#FFA384]" />
                  Probability Distribution
                </h3>
                <div className="w-full h-48 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={probabilityPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {probabilityPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1A1A1A",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "12px",
                          color: "#fff",
                        }}
                        formatter={(value) => `${(value * 100).toFixed(2)}%`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span
                      className="font-bold text-lg"
                      style={{ color: mockData.colour }}
                    >
                      {mockData.final_decision.risk_category}
                    </span>
                    <span className="text-sm text-gray-400">Risk Category</span>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#27ae60]"></div>
                    <span className="text-gray-400 text-sm">Approval Prob.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#e74c3c]"></div>
                    <span className="text-gray-400 text-sm">Default Risk</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#141414] rounded-3xl p-6 border border-white/5 flex-1">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#FFA384]" />
                  Recommendations
                </h3>

                <div className="space-y-3">
                  {mockData.recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-[#1A1A1A] rounded-xl border border-white/5"
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          mockData.final_decision.approved
                            ? "bg-green-500/10"
                            : "bg-yellow-500/10"
                        }`}
                      >
                        {mockData.final_decision.approved ? (
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 text-yellow-500" />
                        )}
                      </div>
                      <p className="text-gray-300 text-sm flex-1">
                        {rec.replace("• ", "")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
