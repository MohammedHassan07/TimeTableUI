import React, { useEffect, useState } from 'react'
import getRequest from '../services/getRequest'

const departments = ['Computer', 'Mechanical', 'Civil', 'Electrical']
const semesters = ['1', '2', '3', '4', '5', '6', '7', '8']


const practicals = ['Subject 1', 'Subject 2']

const AssignSubjects = () => {

    const [subjectsByYear, setSubjectsByYear] = useState({})
    const [teachers, setTeachers] = useState([]);
    const [department, setDepartment] = useState('')
    // const [semester, setSemester] = useState('')
    const [faculty, setFaculty] = useState('')
    const [selectedSubjects, setSelectedSubjects] = useState({})

    const handleSubjectChange = (year, subject) => {
        setSelectedSubjects((prev) => ({
            ...prev,
            [`${year}-${subject}`]: !prev[`${year}-${subject}`],
        }))
    }

    const handleSubmit = () => {
        const assigned = Object.keys(selectedSubjects).filter(key => selectedSubjects[key])
        console.log('Assigned Subjects to Faculty:', {
            department,
            semester,
            faculty,
            assignedSubjects: assigned
        })
        alert('Subjects assigned successfully (mock)')
    }


    useEffect(() => {
        if (!department) return;

        const loadTeachersData = async () => {
            try {
                const { teachers } = await getRequest(`/api/teacher/view-teacher-by-department/${department}`);
                const { subjects } = await getRequest(`/api/subject/view-subjects-by-department/${department}`);

                setSubjectsByYear(subjects || {});
                setTeachers(teachers || []);

                console.log(teachers, subjects)
            } catch (err) {
                console.error("Failed to load data", err);
            }
        }

        loadTeachersData();
    }, [department]);

    useEffect(() => {
        setTeachers([]);
        setSubjectsByYear({});
        setFaculty('');
    }, [department]);


    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Assign Subjects to Faculty</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <select
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="">Select Department</option>
                    {departments.map((d, i) => <option key={i} value={d}>{d}</option>)}
                </select>

                {/* <select
                    value={semester}
                    onChange={e => setSemester(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="">Select Semester</option>
                    {semesters.map((s, i) => <option key={i} value={s}>{s}</option>)}
                </select> */}

                <select
                    value={faculty}
                    onChange={e => setFaculty(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="">Select Faculty</option>
                    {teachers.map((f) => <option key={f._id} value={f._id}>{f.name}</option>)}
                </select>
            </div>

            {/* Subjects by Year */}
            {Object.entries(subjectsByYear).map(([year, subjects]) => (
                <div key={year} className="mb-8">
                    <h3 className="text-xl font-semibold mb-2">{year}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-2">
                        {subjects.map((subject, i) => (
                            <label key={i} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={!!selectedSubjects[`${year}-${subject}`]}
                                    onChange={() => handleSubjectChange(year, subject)}
                                />
                                <span>{subject}</span>
                            </label>
                        ))}
                    </div>

                    {/* Practicals */}
                    <div className="mt-4">
                        <h4 className="font-medium">Practicals</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-1">
                            {practicals.map((practical, i) => (
                                <label key={i} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={!!selectedSubjects[`${year}-Practical-${practical}`]}
                                        onChange={() => handleSubjectChange(year, `Practical-${practical}`)}
                                    />
                                    <span>{practical}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            ))}

            <div className="flex justify-center">
                <button
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    Submit
                </button>
            </div>
        </div>
    )
}

export default AssignSubjects
