osmd
    graphic GraphicalMusicSheet
        measureList GraphicalMeasure 二维数组，1维存放行信息，二维存放小节下的数据
            staffEntries GraphicalStaffEntry 图形化五线谱演奏信息数组(存放每一列音符信息)
                graphicalVoiceEntries GraphicalVoiceEntry 图形化声音演奏信息（一列音符信息）
                    notes GraphicalNote 图形化音符，如果是和弦的话，notes的数组就会是和弦的音符总数

                


    Sheet MusicSheet
        SourceMeasures SourceMeasure 小节信息
            VerticlaMeasureList GraphicalMeasure 小节的行列表
                staffEntries GraphicalStaffEntry 每个列的音符入口
                    sourceStaffEntry SourceStaffEntry
                    graphicalVoiceEntries GraphicalVoiceEntry

        Staves Staff 数组，存放了每一行的五线谱信息
            Voices Voice 数组，
                VoiceEntries VoiceEntry


分析load方法
    给osmd添加新的小节的顺序
        let measure = new SourceMeasure(乐器index) 新建小节
        循环创建staffEntry填充小节
        let staffEntry = measure.findOrCreateStaffEntry() 新建演奏入口
        使用VoiceGenerator创建VoiceEntry
        currentVoiceGenerator.createVoiceEntry
        或者直接new VoiceEntry,push到Voice中
        使用VoiceGenerator.read()生成所有note，并且push到voiceentry的notes中
        或者使用new Note，自己push到VoiceEntry中
        osmd是用voicegenerator统一处理的        






词汇：
measure 小节
stave   五线谱
staff   五线谱
octave  八度

clefinstruction(OSMD) clef(vexflow) 谱号
instrument 乐器
rhythminstruction(OSMD) TimeSignature(vexflow)  节拍
keyinstruction(OSMD) (key signature(vexflow)) 调号

modifier 调节器
    accidental (升、降、还原)临时记号的，临时符的
    repetition

chord   和弦

pitch   音高（根音等）
notehead 符头
stem    符干
beam    符杠
dot     附点
