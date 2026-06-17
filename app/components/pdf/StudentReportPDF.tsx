import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { StudentReportData } from '~/types/loaders-data/admin'
import { SemesterAjaranUrutan } from '~/database/enums/prisma.enums'

const MIN_TABLE_ROWS = parseInt(process.env.REPORT_MIN_ROWS ?? '20', 10)
const MIN_COMPETENCY_TABLE_ROWS = parseInt(process.env.COMPETENCY_REPORT_MIN_ROWS ?? '16', 10)

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 35,
    color: '#000',
  },
  // Header
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  headerText: { flex: 1, textAlign: 'center' },
  schoolName: { fontSize: 13, fontFamily: 'Helvetica-Bold', textAlign: 'center' },
  schoolSub: { fontSize: 9, textAlign: 'center', marginTop: 2 },
  divider: { borderBottomWidth: 1.5, borderBottomColor: '#000', marginBottom: 6, marginTop: 6 },
  dividerThin: { borderBottomWidth: 0.5, borderBottomColor: '#000', marginBottom: 4, marginTop: 4 },
  // Title
  title: { fontSize: 11, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 2 },
  subtitle: { fontSize: 9, textAlign: 'center', marginBottom: 10 },
  // Info block
  infoRow: { flexDirection: 'row', marginBottom: 2 },
  infoLabel: { width: 110 },
  infoColon: { width: 10 },
  infoValue: { flex: 1 },
  // Tables
  table: { width: '100%', marginTop: 6, marginBottom: 6 },
  tableRow: { flexDirection: 'row' },
  tableHeader: { backgroundColor: '#e8e8e8' },
  cellNo: { width: 25, borderWidth: 0.5, borderColor: '#000', padding: 3, textAlign: 'center' },
  cellSubject: { flex: 2, borderWidth: 0.5, borderColor: '#000', padding: 3 },
  cellKkm: { width: 35, borderWidth: 0.5, borderColor: '#000', padding: 3, textAlign: 'center' },
  cellScore: { width: 45, borderWidth: 0.5, borderColor: '#000', padding: 3, textAlign: 'center' },
  cellActivity: { flex: 2, borderWidth: 0.5, borderColor: '#000', padding: 3 },
  cellGrade: { width: 50, borderWidth: 0.5, borderColor: '#000', padding: 3, textAlign: 'center' },
  cellAttend: { flex: 1, borderWidth: 0.5, borderColor: '#000', padding: 3, textAlign: 'center' },
  cellAttendLabel: { flex: 2, borderWidth: 0.5, borderColor: '#000', padding: 3 },
  cellAttendValue: { width: 30, borderWidth: 0.5, borderColor: '#000', padding: 3, textAlign: 'center' },
  sideSection: { flexDirection: 'row', marginTop: 6, marginBottom: 6 },
  leftCol: { width: '50%' },
  rightCol: { flex: 1 },
  cellDesc: { flex: 3, borderWidth: 0.5, borderColor: '#000', padding: 3 },
  bold: { fontFamily: 'Helvetica-Bold' },
  // Notes section
  noteBox: { marginTop: 6, marginBottom: 6 },
  noteLabel: { fontFamily: 'Helvetica-Bold', marginBottom: 3 },
  noteContent: { minHeight: 50.5, borderWidth: 0.5, borderColor: '#000', padding: 4 },
  // Signature
  signatureSection: { flexDirection: 'row', marginTop: 16 },
  signatureBox: { flex: 1, alignItems: 'center' },
  signatureName: { fontFamily: 'Helvetica-Bold', marginTop: 40, textAlign: 'center' },
  signatureUnderline: { borderBottomWidth: 0.5, borderBottomColor: '#000', width: '80%', marginTop: 2 },
})

function ReportHeader({ data }: { data: StudentReportData }) {
  return (
    <>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={styles.schoolName}>{data.schoolName}</Text>
          <Text style={styles.schoolSub}>{data.schoolAddress}</Text>
          <Text style={styles.schoolSub}>Phone: {data.schoolPhone}</Text>
        </View>
      </View>
      <View style={styles.divider} />
    </>
  )
}

function StudentInfoBlock({ data }: { data: StudentReportData }) {
  const semLabel = data.semesterAjaran.urutan === SemesterAjaranUrutan.SATU ? 'Semester 1' : 'Semester 2'
  return (
    <View style={{ marginBottom: 8 }}>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Student Name</Text>
        <Text style={styles.infoColon}>:</Text>
        <Text style={styles.infoValue}>
          {data.student.firstName} {data.student.lastName}
        </Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Class / Student ID</Text>
        <Text style={styles.infoColon}>:</Text>
        <Text style={styles.infoValue}>
          {data.kelas.nama} / {data.student.username}
        </Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Attendance Number</Text>
        <Text style={styles.infoColon}>:</Text>
        <Text style={styles.infoValue}>{data.nomorAbsen ?? '-'}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Semester</Text>
        <Text style={styles.infoColon}>:</Text>
        <Text style={styles.infoValue}>{semLabel}</Text>
      </View>
    </View>
  )
}

function AcademicTable({ data, emptyRows = 0 }: { data: StudentReportData; emptyRows?: number }) {
  const dataCount = data.academicAssessments.length
  return (
    <View style={styles.table}>
      <View style={[styles.tableRow, styles.tableHeader]}>
        <Text style={[styles.cellNo, styles.bold]}>No</Text>
        <Text style={[styles.cellSubject, styles.bold]}>Subject</Text>
        <Text style={[styles.cellKkm, styles.bold]}>KKM</Text>
        <Text style={[styles.cellScore, styles.bold]}>Score</Text>
      </View>
      {data.academicAssessments.map((item, idx) => {
        const finalScore = item.penilaians.find(p => p.kompetensi.id === 'FS')
        return (
          <View key={item.mataPelajaran.id} style={styles.tableRow}>
            <Text style={styles.cellNo}>{idx + 1}</Text>
            <Text style={styles.cellSubject}>{item.mataPelajaran.nama}</Text>
            <Text style={styles.cellKkm}>{item.kkm}</Text>
            <Text style={styles.cellScore}>{finalScore?.nilai?.toString() ?? '-'}</Text>
          </View>
        )
      })}
      {Array.from({ length: emptyRows }).map((_, i) => (
        <View key={`pad-${i}`} style={styles.tableRow}>
          <Text style={styles.cellNo}>{dataCount + i + 1}</Text>
          <Text style={styles.cellSubject}> </Text>
          <Text style={styles.cellKkm}> </Text>
          <Text style={styles.cellScore}> </Text>
        </View>
      ))}
    </View>
  )
}

function ExtracurricularTable({ data }: { data: StudentReportData }) {
  if (data.extracurricularAssessments.length === 0) return null
  return (
    <View style={styles.table}>
      <Text style={[styles.bold, { marginBottom: 3 }]}>Self Development / Extracurricular</Text>
      <View style={[styles.tableRow, styles.tableHeader]}>
        <Text style={[styles.cellNo, styles.bold]}>No</Text>
        <Text style={[styles.cellActivity, styles.bold]}>Activity</Text>
        <Text style={[styles.cellGrade, styles.bold]}>Grade</Text>
      </View>
      {data.extracurricularAssessments.map((item, idx) => {
        const avgScore =
          item.penilaians.length > 0
            ? item.penilaians.reduce((sum, p) => sum + Number(p.nilai ?? 0), 0) / item.penilaians.length
            : null
        return (
          <View key={item.ekstrakulikuler.id} style={styles.tableRow}>
            <Text style={styles.cellNo}>{idx + 1}</Text>
            <Text style={styles.cellActivity}>{item.ekstrakulikuler.nama}</Text>
            <Text style={styles.cellGrade}>{avgScore !== null ? Math.round(avgScore) : '-'}</Text>
          </View>
        )
      })}
    </View>
  )
}

function AttendanceAndNoteSection({ data }: { data: StudentReportData }) {
  return (
    <View style={styles.sideSection}>
      {/* Left: Attendance */}
      <View style={styles.leftCol}>
        <Text style={[styles.bold]}>Attendance</Text>
        <View style={[styles.table, { marginTop: 3 }]}>
          <View style={styles.tableRow}>
            <Text style={[styles.cellAttendLabel, styles.tableHeader, styles.bold]}>Sick</Text>
            <Text style={[styles.cellAttendValue]}>{data.attendanceSummary.sick}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.cellAttendLabel, styles.tableHeader, styles.bold]}>Excused</Text>
            <Text style={[styles.cellAttendValue]}>{data.attendanceSummary.excused}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.cellAttendLabel, styles.tableHeader, styles.bold]}>Unexcused</Text>
            <Text style={[styles.cellAttendValue]}>{data.attendanceSummary.unexcused}</Text>
          </View>
        </View>
      </View>
      {/* Right: Homeroom Note */}
      <View style={styles.rightCol}>
        <Text style={styles.noteLabel}>Homeroom Teacher Notes</Text>
        <View style={[styles.noteContent]}>
          <Text>{data.homeroomTeacherNote ?? ''}</Text>
        </View>
      </View>
    </View>
  )
}

function SignatureSection({ data }: { data: StudentReportData }) {
  return (
    <View style={styles.signatureSection}>
      <View style={styles.signatureBox}>
        <Text>Principal</Text>
        <Text style={styles.signatureName}>{'_______________________'}</Text>
      </View>
      <View style={styles.signatureBox}>
        <Text>Parent / Guardian</Text>
        <Text style={styles.signatureName}>{'_______________________'}</Text>
      </View>
      <View style={styles.signatureBox}>
        <Text>Homeroom Teacher</Text>
        <Text style={styles.signatureName}>
          {data.kelas.wali ? `${data.kelas.wali.firstName} ${data.kelas.wali.lastName}` : '_______________________'}
        </Text>
      </View>
    </View>
  )
}

function CompetencyPage({ data }: { data: StudentReportData }) {
  const academicYear = data.semesterAjaran.tahunAjaran.nama
  const dataCount = data.competencyDescriptions.length
  const emptyRows = Math.max(0, MIN_COMPETENCY_TABLE_ROWS - dataCount)

  return (
    <Page size='A4' style={styles.page}>
      <ReportHeader data={data} />
      <Text style={styles.title}>COMPETENCY ACHIEVEMENT DESCRIPTIONS</Text>
      <Text style={styles.subtitle}>ACADEMIC YEAR {academicYear}</Text>
      <View style={styles.dividerThin} />
      <StudentInfoBlock data={data} />
      <View style={styles.dividerThin} />
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.cellNo, styles.bold]}>No</Text>
          <Text style={[styles.cellSubject, styles.bold]}>Subject</Text>
          <Text style={[styles.cellDesc, styles.bold]}>Description</Text>
        </View>
        {data.competencyDescriptions.map((item, idx) => (
          <View key={item.id} style={styles.tableRow} wrap={false}>
            <Text style={styles.cellNo}>{idx + 1}</Text>
            <Text style={styles.cellSubject}>{item.mataPelajaran.nama}</Text>
            <Text style={styles.cellDesc}>{item.description ?? ''}</Text>
          </View>
        ))}
        {Array.from({ length: emptyRows }).map((_, i) => (
          <View key={`pad-${i}`} style={styles.tableRow} wrap={false}>
            <Text style={styles.cellNo}>{dataCount + i + 1}</Text>
            <Text style={styles.cellSubject}> </Text>
            <Text style={styles.cellDesc}> </Text>
          </View>
        ))}
      </View>
    </Page>
  )
}

type Props = { data: StudentReportData }

export default function StudentReportPDF({ data }: Props) {
  const academicYear = data.semesterAjaran.tahunAjaran.nama
  const totalRows = data.academicAssessments.length + data.extracurricularAssessments.length
  const emptyRows = Math.max(0, MIN_TABLE_ROWS - totalRows)

  return (
    <Document>
      {/* Section 1 - Semester Report Card */}
      <Page size='A4' style={styles.page}>
        <ReportHeader data={data} />
        <Text style={styles.title}>SEMESTER REPORT CARD</Text>
        <Text style={styles.subtitle}>ACADEMIC YEAR {academicYear}</Text>
        <View style={styles.dividerThin} />
        <StudentInfoBlock data={data} />
        <View style={styles.dividerThin} />
        <Text style={[styles.bold, { marginBottom: 3 }]}>Academic Assessment</Text>
        <AcademicTable data={data} emptyRows={emptyRows} />
        <ExtracurricularTable data={data} />
        <AttendanceAndNoteSection data={data} />
        <SignatureSection data={data} />
      </Page>
      {/* Section 2 - Competency Achievement Descriptions */}
      <CompetencyPage data={data} />
    </Document>
  )
}
